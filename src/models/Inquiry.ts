import mongoose, { Document, Model, Schema } from "mongoose";

export type InquiryStatus = "new" | "contacted" | "resolved" | "closed";

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  service: string;
  message: string;
  city?: string;
  status: InquiryStatus;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    service: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "resolved", "closed"],
      default: "new",
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ phone: 1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
