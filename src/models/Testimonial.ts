import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITestimonial extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    title: string;
    type: "text" | "video";
    videoUrl?: string;
    thumbnailUrl?: string;
    text?: string;
    rating: number;
    status: "active" | "inactive";
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: { type: String, required: true },
        title: { type: String, required: true },
        type: { type: String, enum: ["text", "video"], default: "text" },
        videoUrl: { type: String },
        thumbnailUrl: { type: String },
        text: { type: String },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
    mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
