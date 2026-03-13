import cron from "node-cron";
import mongoose from "mongoose";

import { Order } from "../models/Order.js";

interface SummaryNotifier {
  (summary: {
    date: Date;
    todaysDeliveries: number;
    todaysAmount: number;
    overdueCount: number;
    overdueAmount: number;
  }): Promise<void> | void;
}

async function computeDailySummary(ownerId: mongoose.Types.ObjectId) {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [todaysDeliveriesAgg, overdueAgg] = await Promise.all([
    Order.aggregate<{ _id: null; count: number; totalAmount: number }>([
      {
        $match: {
          ownerId,
          deliveryDate: { $gte: startOfDay, $lte: endOfDay }
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
    Order.aggregate<{ _id: null; overdueCount: number; overdueAmount: number }>([
      {
        $match: {
          ownerId,
          balance: { $gt: 0 },
          deliveryDate: { $lt: now }
        }
      },
      {
        $group: {
          _id: null,
          overdueCount: { $sum: 1 },
          overdueAmount: { $sum: "$balance" }
        }
      }
    ])
  ]);

  const todaysDeliveries = todaysDeliveriesAgg[0] ?? { count: 0, totalAmount: 0 };
  const overdue = overdueAgg[0] ?? { overdueCount: 0, overdueAmount: 0 };

  return {
    date: now,
    todaysDeliveries: todaysDeliveries.count,
    todaysAmount: todaysDeliveries.totalAmount,
    overdueCount: overdue.overdueCount,
    overdueAmount: overdue.overdueAmount
  };
}

// Run every day at 8 AM server time
export function scheduleDailySummary(notify?: SummaryNotifier): void {
  const ownerIdEnv = process.env.DAILY_SUMMARY_OWNER_ID;
  if (!ownerIdEnv || !mongoose.isValidObjectId(ownerIdEnv)) {
    // eslint-disable-next-line no-console
    console.warn("DAILY_SUMMARY_OWNER_ID is not set or invalid. Daily summary cron will not run.");
    return;
  }

  const ownerObjectId = new mongoose.Types.ObjectId(ownerIdEnv);

  cron.schedule("0 8 * * *", async () => {
    try {
      const summary = await computeDailySummary(ownerObjectId);

      if (notify) {
        await notify(summary);
      } else {
        // Default: log to console
        // eslint-disable-next-line no-console
        console.log(
          "[DailySummary]",
          summary.date.toISOString(),
          `Deliveries: ${summary.todaysDeliveries} (₹${summary.todaysAmount}),`,
          `Overdue: ${summary.overdueCount} (₹${summary.overdueAmount})`
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error running daily summary cron:", error);
    }
  });
}

