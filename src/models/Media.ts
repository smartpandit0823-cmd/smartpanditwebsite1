import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMedia extends Document {
  _id: mongoose.Types.ObjectId;
  url: string;
  type: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    type: { type: String, required: true },
    entityType: { type: String },
    entityId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

MediaSchema.index({ entityType: 1, entityId: 1 });

const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
