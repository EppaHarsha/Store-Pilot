import mongoose, { type Document, type Model } from "mongoose";

export type OrderStatus = "received" | "in_progress" | "ready" | "delivered";

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  orderDetails: string;
  deliveryDate: Date;
  totalAmount: number;
  advancePaid: number;
  balance: number;
  status: OrderStatus;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    orderDetails: {
      type: String,
      required: true,
      trim: true
    },
    deliveryDate: {
      type: Date,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    advancePaid: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ["received", "in_progress", "ready", "delivered"],
      required: true,
      default: "received"
    },
    photo: {
      type: String,
      required: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

