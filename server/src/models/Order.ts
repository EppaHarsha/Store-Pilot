import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  customerName: string;
  serviceName: string;
  deliveryDate: Date;
  totalAmount: number;
  advancePaid: number;
  balance: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    serviceName: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true, default: 0 },
    advancePaid: { type: Number, required: true, default: 0 },
    balance: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
