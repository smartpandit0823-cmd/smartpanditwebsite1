import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISetting extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  value: unknown;
  group: string;
  label: string;
  type: "string" | "number" | "boolean" | "json" | "array";
  isPublic: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: { type: String, required: true, default: "general" },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["string", "number", "boolean", "json", "array"],
      default: "string",
    },
    isPublic: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true }
);

SettingSchema.index({ key: 1 });
SettingSchema.index({ group: 1 });

const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
