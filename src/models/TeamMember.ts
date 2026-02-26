import mongoose, { Document, Model, Schema } from "mongoose";

export type TeamRole = "pandit" | "astrologer" | "support" | "delivery";
export type TeamStatus = "active" | "inactive" | "suspended";

export interface ITeamMember extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    phone: string;
    email?: string;
    photo?: string;
    role: TeamRole;
    skills: string[];
    area: string;
    city: string;
    state: string;
    experience: number;
    languagesSpoken: string[];
    bio?: string;
    status: TeamStatus;
    verificationStatus: "pending" | "verified" | "rejected";
    totalCompleted: number;
    averageRating: number;
    joinedAt: Date;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true },
        email: { type: String, trim: true, lowercase: true },
        photo: { type: String },
        role: {
            type: String,
            enum: ["pandit", "astrologer", "support", "delivery"],
            required: true,
        },
        skills: [{ type: String }],
        area: { type: String, default: "" },
        city: { type: String, required: true },
        state: { type: String, required: true },
        experience: { type: Number, default: 0 },
        languagesSpoken: [{ type: String }],
        bio: { type: String },
        status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        totalCompleted: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        joinedAt: { type: Date, default: Date.now },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

TeamMemberSchema.index({ role: 1, status: 1 });
TeamMemberSchema.index({ name: "text" });

const TeamMember: Model<ITeamMember> =
    mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;
