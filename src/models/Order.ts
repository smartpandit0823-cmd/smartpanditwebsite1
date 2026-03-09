import mongoose, { Document, Model, Schema } from "mongoose";

export type OrderStatus = "created" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress: { name: string; phone: string; address: string; city: string; state: string; pincode: string };
  trackingId?: string;
  delhiveryWaybill?: string;
  delhiveryStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    status: { type: String, enum: ["created", "paid", "processing", "shipped", "delivered", "cancelled"], default: "created" },
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    trackingId: { type: String },
    delhiveryWaybill: { type: String },
    delhiveryStatus: { type: String },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1, createdAt: -1 });
OrderSchema.index({ status: 1, paymentStatus: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
