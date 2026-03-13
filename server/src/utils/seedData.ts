import mongoose from "mongoose";

import { Customer } from "../models/Customer.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";

const MONGODB_URI = process.env.MONGODB_URI;
const SEED_OWNER_ID = process.env.SEED_OWNER_ID;

if (!MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.error("MONGODB_URI is required to run seedData.");
}

if (!SEED_OWNER_ID || !mongoose.isValidObjectId(SEED_OWNER_ID)) {
  // eslint-disable-next-line no-console
  console.error("SEED_OWNER_ID must be set to a valid User _id.");
}

async function connect(): Promise<void> {
  if (!MONGODB_URI || !SEED_OWNER_ID) {
    throw new Error("Missing MONGODB_URI or SEED_OWNER_ID");
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME ?? undefined
  });
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed(): Promise<void> {
  await connect();

  const ownerId = new mongoose.Types.ObjectId(SEED_OWNER_ID);

  // Clean previous demo data for this owner
  await Promise.all([
    Customer.deleteMany({ ownerId }),
    Order.deleteMany({ ownerId }),
    Payment.deleteMany({ ownerId })
  ]);

  const customerDocs = await Customer.insertMany(
    Array.from({ length: 10 }).map((_, i) => ({
      name: `Customer ${i + 1}`,
      phone: `99900000${(i + 1).toString().padStart(2, "0")}`,
      address: `Street ${i + 1}`,
      ownerId
    }))
  );

  const orders: InstanceType<typeof Order>[] = [];

  for (let i = 0; i < 20; i++) {
    const customer = customerDocs[randInt(0, customerDocs.length - 1)];
    const totalAmount = randInt(200, 2000);
    const advancePaid = randInt(0, totalAmount - 50);
    const balance = totalAmount - advancePaid;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + randInt(-3, 5));

    const order = await Order.create({
      customerId: customer._id,
      ownerId,
      orderDetails: `Order #${i + 1}`,
      deliveryDate,
      totalAmount,
      advancePaid,
      balance,
      status: "received",
      photo: ""
    });

    orders.push(order);
  }

  // Create 5 pending payments (partial payments)
  const pendingOrders = orders
    .filter((o) => o.balance > 0)
    .slice(0, 5);

  for (const order of pendingOrders) {
    const payAmount = Math.max(50, Math.round(order.balance / 2));

    await Payment.create({
      customerId: order.customerId,
      orderId: order._id,
      ownerId,
      amount: payAmount,
      method: "cash",
      date: new Date()
    });

    order.advancePaid += payAmount;
    order.balance = Math.max(0, order.totalAmount - order.advancePaid);
    await order.save();
  }

  // Recompute customer aggregates
  for (const customer of customerDocs) {
    const agg = await Order.aggregate<{
      _id: mongoose.Types.ObjectId;
      totalOrders: number;
      totalSpent: number;
      pendingAmount: number;
    }>([
      { $match: { customerId: customer._id, ownerId } },
      {
        $group: {
          _id: "$customerId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          pendingAmount: { $sum: "$balance" }
        }
      }
    ]);

    const stats = agg[0] ?? { totalOrders: 0, totalSpent: 0, pendingAmount: 0 };

    await Customer.updateOne(
      { _id: customer._id },
      {
        $set: {
          totalOrders: stats.totalOrders,
          totalSpent: stats.totalSpent,
          pendingAmount: stats.pendingAmount
        }
      }
    );
  }

  // eslint-disable-next-line no-console
  console.log("Seed data created for owner:", SEED_OWNER_ID);

  await mongoose.disconnect();
}

// Allow running as a script: `ts-node src/utils/seedData.ts` (or compiled JS)
if (require.main === module) {
  seed()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Seed completed.");
      process.exit(0);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

export { seed };

