import type { Request, Response } from "express";
import mongoose from "mongoose";

import { Customer } from "../models/Customer.js";
import { Order, type OrderStatus } from "../models/Order.js";

interface CreateOrderBody {
  customerId?: string;
  orderDetails?: string;
  deliveryDate?: string | Date;
  totalAmount?: number;
  advancePaid?: number;
  status?: OrderStatus;
  photo?: string;
}

interface UpdateStatusBody {
  status?: OrderStatus;
}

function requireOwnerId(req: Request, res: Response): string | null {
  const ownerId = req.userId;
  if (!ownerId) {
    res.status(401).json({ message: "Not authorized" });
    return null;
  }
  return ownerId;
}

async function recomputeCustomerStats(customerId: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId) {
  const agg = await Order.aggregate<{
    _id: mongoose.Types.ObjectId;
    totalOrders: number;
    totalSpent: number;
    pendingAmount: number;
  }>([
    { $match: { customerId, ownerId } },
    {
      $group: {
        _id: "$customerId",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
        pendingAmount: { $sum: "$balance" }
      }
    }
  ]);

  const next = agg[0] ?? { totalOrders: 0, totalSpent: 0, pendingAmount: 0 };

  await Customer.updateOne(
    { _id: customerId, ownerId },
    {
      $set: {
        totalOrders: next.totalOrders,
        totalSpent: next.totalSpent,
        pendingAmount: next.pendingAmount
      }
    }
  );
}

export const createOrder = async (
  req: Request<unknown, unknown, CreateOrderBody>,
  res: Response
): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const {
      customerId,
      orderDetails,
      deliveryDate,
      totalAmount,
      advancePaid,
      status,
      photo
    } = req.body ?? {};

    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      res.status(400).json({ message: "Valid customerId is required." });
      return;
    }
    if (!orderDetails || !deliveryDate || typeof totalAmount !== "number") {
      res.status(400).json({ message: "orderDetails, deliveryDate, totalAmount are required." });
      return;
    }

    const advance = typeof advancePaid === "number" ? advancePaid : 0;
    if (advance < 0 || totalAmount < 0) {
      res.status(400).json({ message: "Amounts must be non-negative." });
      return;
    }

    const computedBalance = Math.max(0, totalAmount - advance);

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const customerObjectId = new mongoose.Types.ObjectId(customerId);

    const customer = await Customer.findOne({ _id: customerObjectId, ownerId: ownerObjectId }).lean();
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const order = await Order.create({
      customerId: customerObjectId,
      ownerId: ownerObjectId,
      orderDetails: orderDetails.trim(),
      deliveryDate: new Date(deliveryDate),
      totalAmount,
      advancePaid: advance,
      balance: computedBalance,
      status: status ?? "received",
      photo: photo ?? ""
    });

    await recomputeCustomerStats(customerObjectId, ownerObjectId);

    const populated = await Order.findById(order._id).populate("customerId", "name phone address");
    res.status(201).json({ order: populated });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const orders = await Order.find({ ownerId })
      .sort({ createdAt: -1 })
      .populate("customerId", "name phone address")
      .lean();

    res.json({ orders });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getOrders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const { id } = req.params as { id?: string };
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid order id" });
      return;
    }

    const order = await Order.findOne({ _id: id, ownerId })
      .populate("customerId", "name phone address")
      .lean();

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json({ order });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getOrderById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (
  req: Request<{ id: string }, unknown, UpdateStatusBody>,
  res: Response
): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const { id } = req.params ?? {};
    const { status } = req.body ?? {};

    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid order id" });
      return;
    }

    const allowed: OrderStatus[] = ["received", "in_progress", "ready", "delivered"];
    if (!status || !allowed.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const updated = await Order.findOneAndUpdate(
      { _id: id, ownerId },
      { $set: { status } },
      { new: true }
    ).populate("customerId", "name phone address");

    if (!updated) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json({ order: updated });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const { id } = req.params as { id?: string };
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid order id" });
      return;
    }

    const order = await Order.findOne({ _id: id, ownerId });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const customerObjectId = new mongoose.Types.ObjectId(order.customerId);

    await order.deleteOne();
    await recomputeCustomerStats(customerObjectId, ownerObjectId);

    res.json({ ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in deleteOrder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

