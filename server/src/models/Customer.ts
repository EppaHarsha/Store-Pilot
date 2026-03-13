import mongoose, { type Document, type Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  pendingAmount: number;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new mongoose.Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    totalOrders: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    pendingAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema);

