import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISlider extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SliderSchema = new Schema<ISlider>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Slider: Model<ISlider> =
  mongoose.models.Slider || mongoose.model<ISlider>("Slider", SliderSchema);

export default Slider;
