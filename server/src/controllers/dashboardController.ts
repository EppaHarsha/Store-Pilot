import type { Request, Response } from "express";
import mongoose from "mongoose";

import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";

function requireOwnerId(req: Request, res: Response): string | null {
  const ownerId = req.userId;
  if (!ownerId) {
    res.status(401).json({ message: "Not authorized" });
    return null;
  }
  return ownerId;
}

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = requireOwnerId(req, res);
    if (!ownerId) return;

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [todaysOrdersAgg, pendingAgg, overdueAgg, totalCustomers] = await Promise.all([
      Order.aggregate<{ _id: null; count: number; totalAmount: number }>([
        {
          $match: {
            ownerId: ownerObjectId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" }
          }
        }
      ]),
      Order.aggregate<{ _id: null; pendingAmount: number; pendingCount: number }>([
        { $match: { ownerId: ownerObjectId, balance: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            pendingAmount: { $sum: "$balance" },
            pendingCount: { $sum: 1 }
          }
        }
      ]),
      Order.aggregate<{ _id: null; overdueCount: number; overdueAmount: number }>([
        { $match: { ownerId: ownerObjectId, balance: { $gt: 0 }, deliveryDate: { $lt: now } } },
        {
          $group: {
            _id: null,
            overdueCount: { $sum: 1 },
            overdueAmount: { $sum: "$balance" }
          }
        }
      ]),
      Customer.countDocuments({ ownerId: ownerObjectId })
    ]);

    const todaysOrders = todaysOrdersAgg[0] ?? { count: 0, totalAmount: 0 };
    const pending = pendingAgg[0] ?? { pendingAmount: 0, pendingCount: 0 };
    const overdue = overdueAgg[0] ?? { overdueCount: 0, overdueAmount: 0 };

    res.json({
      todaysOrders: {
        count: todaysOrders.count,
        totalAmount: todaysOrders.totalAmount
      },
      pendingPayments: {
        count: pending.pendingCount,
        amount: pending.pendingAmount
      },
      overdueOrders: {
        count: overdue.overdueCount,
        amount: overdue.overdueAmount
      },
      totalCustomers
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

