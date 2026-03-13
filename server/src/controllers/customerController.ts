import type { Request, Response } from "express";
import mongoose from "mongoose";

import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";

interface CreateCustomerBody {
  name?: string;
  phone?: string;
  address?: string;
}

function requireOwnerId(req: Request, res: Response): string | null {
  const ownerId = req.userId;
  if (!ownerId) {
    res.status(401).json({ message: "Not authorized" });
    return null;
  }
  return ownerId;
}

export const createCustomer = async (
  req: Request<unknown, unknown, CreateCustomerBody>,
  res: Response
): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const { name, phone, address } = req.body ?? {};
    if (!name || !phone || !address) {
      res.status(400).json({ message: "name, phone and address are required." });
      return;
    }

    const customer = await Customer.create({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      ownerId: new mongoose.Types.ObjectId(ownerId)
    });

    res.status(201).json({ customer });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in createCustomer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const customers = await Customer.find({ ownerId })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate pending amount from orders (source of truth)
    const pendingByCustomer = await Order.aggregate<{
      _id: mongoose.Types.ObjectId;
      pendingAmount: number;
    }>([
      { $match: { ownerId: new mongoose.Types.ObjectId(ownerId) } },
      { $group: { _id: "$customerId", pendingAmount: { $sum: "$balance" } } }
    ]);

    const pendingMap = new Map(
      pendingByCustomer.map((p) => [p._id.toString(), Number(p.pendingAmount ?? 0)])
    );

    const enriched = customers.map((c) => ({
      ...c,
      pendingAmount: pendingMap.get(String(c._id)) ?? 0
    }));

    res.json({ customers: enriched });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getCustomers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Enhanced search:
// - Search by name/phone using regex
// - Return recent orders, pending payments (sum of balances), total revenue (sum of payments)
export const searchCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const qRaw = String(req.query.q ?? req.query.query ?? "").trim();
    const nameRaw = String(req.query.name ?? "").trim();
    const phoneRaw = String(req.query.phone ?? "").trim();
    const q = qRaw || nameRaw || phoneRaw;

    if (!q) {
      res.status(400).json({ message: "Provide q (or name/phone) query parameter." });
      return;
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const results = await Customer.aggregate([
      {
        $match: {
          ownerId: ownerObjectId,
          $or: [{ name: { $regex: regex } }, { phone: { $regex: regex } }]
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 25 },
      {
        $lookup: {
          from: "orders",
          let: { customerId: "$_id", ownerId: "$ownerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$customerId", "$$customerId"] },
                    { $eq: ["$ownerId", "$$ownerId"] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                orderDetails: 1,
                deliveryDate: 1,
                totalAmount: 1,
                advancePaid: 1,
                balance: 1,
                status: 1,
                photo: 1,
                createdAt: 1
              }
            }
          ],
          as: "recentOrders"
        }
      },
      {
        $lookup: {
          from: "orders",
          let: { customerId: "$_id", ownerId: "$ownerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$customerId", "$$customerId"] },
                    { $eq: ["$ownerId", "$$ownerId"] }
                  ]
                }
              }
            },
            { $group: { _id: null, pendingPayments: { $sum: "$balance" } } }
          ],
          as: "pendingAgg"
        }
      },
      {
        $lookup: {
          from: "payments",
          let: { customerId: "$_id", ownerId: "$ownerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$customerId", "$$customerId"] },
                    { $eq: ["$ownerId", "$$ownerId"] }
                  ]
                }
              }
            },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
          ],
          as: "revenueAgg"
        }
      },
      {
        $addFields: {
          pendingPayments: {
            $ifNull: [{ $first: "$pendingAgg.pendingPayments" }, 0]
          },
          totalRevenue: {
            $ifNull: [{ $first: "$revenueAgg.totalRevenue" }, 0]
          }
        }
      },
      { $project: { pendingAgg: 0, revenueAgg: 0 } }
    ]);

    res.json({ customers: results });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in searchCustomers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const { id } = req.params as { id?: string };
    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid customer id" });
      return;
    }

    const customer = await Customer.findOne({ _id: id, ownerId }).lean();
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const orders = await Order.find({ customerId: id, ownerId })
      .sort({ createdAt: -1 })
      .lean();

    const pendingAgg = await Order.aggregate<{ _id: null; pendingAmount: number }>([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          customerId: new mongoose.Types.ObjectId(id)
        }
      },
      { $group: { _id: null, pendingAmount: { $sum: "$balance" } } }
    ]);

    const pendingAmount = Number(pendingAgg?.[0]?.pendingAmount ?? 0);

    const revenueAgg = await Payment.aggregate<{ _id: null; totalRevenue: number }>([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          customerId: new mongoose.Types.ObjectId(id)
        }
      },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = Number(revenueAgg?.[0]?.totalRevenue ?? 0);

    res.json({
      customer: {
        ...customer,
        pendingAmount,
        totalRevenue
      },
      orders
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getCustomerById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

