import mongoose, { Document, Model, Schema } from "mongoose";

export type AnalyticsEventType =
    | "page_view"
    | "session_start"
    | "session_end"
    | "booking_initiated"
    | "booking_completed"
    | "payment_success"
    | "payment_failed"
    | "product_view"
    | "add_to_cart"
    | "order_placed"
    | "astrology_request"
    | "search";

export interface IAnalyticsEvent extends Document {
    _id: mongoose.Types.ObjectId;
    event: AnalyticsEventType;
    sessionId: string;
    userId?: mongoose.Types.ObjectId;
    page?: string;
    referrer?: string;
    device?: "mobile" | "desktop" | "tablet";
    browser?: string;
    ip?: string;
    metadata?: Record<string, unknown>;
    revenue?: number;
    revenueSource?: "puja" | "store" | "astrology";
    createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
    {
        event: {
            type: String,
            enum: [
                "page_view",
                "session_start",
                "session_end",
                "booking_initiated",
                "booking_completed",
                "payment_success",
                "payment_failed",
                "product_view",
                "add_to_cart",
                "order_placed",
                "astrology_request",
                "search",
            ],
            required: true,
        },
        sessionId: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        page: { type: String },
        referrer: { type: String },
        device: { type: String, enum: ["mobile", "desktop", "tablet"] },
        browser: { type: String },
        ip: { type: String },
        metadata: { type: Schema.Types.Mixed },
        revenue: { type: Number },
        revenueSource: { type: String, enum: ["puja", "store", "astrology"] },
    },
    { timestamps: true }
);

AnalyticsEventSchema.index({ event: 1, createdAt: -1 });
AnalyticsEventSchema.index({ sessionId: 1 });
AnalyticsEventSchema.index({ revenueSource: 1, createdAt: -1 });
AnalyticsEventSchema.index({ createdAt: -1 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
    mongoose.models.AnalyticsEvent ||
    mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;
