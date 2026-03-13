import type { Request, Response } from "express";
import mongoose from "mongoose";

import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
import { Payment, type PaymentMethod } from "../models/Payment.js";

interface RecordPaymentBody {
  customerId?: string;
  orderId?: string;
  amount?: number;
  method?: PaymentMethod;
  date?: string | Date;
}

function requireOwnerId(req: Request, res: Response): string | null {
  const ownerId = req.userId;
  if (!ownerId) {
    res.status(401).json({ message: "Not authorized" });
    return null;
  }
  return ownerId;
}

async function recomputeCustomerPending(customerId: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId) {
  const agg = await Order.aggregate<{ _id: null; pendingAmount: number }>([
    { $match: { customerId, ownerId } },
    { $group: { _id: null, pendingAmount: { $sum: "$balance" } } }
  ]);
  const pendingAmount = Number(agg?.[0]?.pendingAmount ?? 0);
  await Customer.updateOne({ _id: customerId, ownerId }, { $set: { pendingAmount } });
}

export const recordPayment = async (
  req: Request<unknown, unknown, RecordPaymentBody>,
  res: Response
): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const { customerId, orderId, amount, method, date } = req.body ?? {};

    if (!customerId || !mongoose.isValidObjectId(customerId)) {
      res.status(400).json({ message: "Valid customerId is required." });
      return;
    }
    if (!orderId || !mongoose.isValidObjectId(orderId)) {
      res.status(400).json({ message: "Valid orderId is required." });
      return;
    }
    if (typeof amount !== "number" || amount <= 0) {
      res.status(400).json({ message: "amount must be a positive number." });
      return;
    }
    const allowedMethods: PaymentMethod[] = ["cash", "upi", "card"];
    if (!method || !allowedMethods.includes(method)) {
      res.status(400).json({ message: "Invalid payment method." });
      return;
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    const orderObjectId = new mongoose.Types.ObjectId(orderId);

    const order = await Order.findOne({ _id: orderObjectId, ownerId: ownerObjectId, customerId: customerObjectId });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Support partial payments: just ensure we don't apply more than outstanding balance.
    const applyAmount = Math.min(amount, Number(order.balance ?? 0));

    const payment = await Payment.create({
      customerId: customerObjectId,
      orderId: orderObjectId,
      ownerId: ownerObjectId,
      amount: applyAmount,
      method,
      date: date ? new Date(date) : new Date()
    });

    const nextAdvance = Number(order.advancePaid ?? 0) + applyAmount;
    const nextBalance = Math.max(0, Number(order.totalAmount ?? 0) - nextAdvance);

    order.advancePaid = nextAdvance;
    order.balance = nextBalance;
    await order.save();

    await recomputeCustomerPending(customerObjectId, ownerObjectId);

    res.status(201).json({ payment, order });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in recordPayment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Pending payments: orders with outstanding balance
export const getPendingPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const now = new Date();

    const orders = await Order.find({ ownerId, balance: { $gt: 0 } })
      .sort({ deliveryDate: 1 })
      .populate("customerId", "name phone address")
      .lean();

    const overdue = orders.filter((o) => (o.deliveryDate ? new Date(o.deliveryDate) < now : false));
    const overdueAmount = overdue.reduce((sum, o) => sum + Number(o.balance ?? 0), 0);

    res.json({
      pending: orders,
      overdue: {
        count: overdue.length,
        amount: overdueAmount
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getPendingPayments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Collect payment = recordPayment (kept separate for API semantics)
export const collectPayment = async (req: Request, res: Response): Promise<void> => {
  await recordPayment(req as Request<unknown, unknown, RecordPaymentBody>, res);
};

