import mongoose, { Document, Model, Schema } from "mongoose";

export type FestivalType = "festival" | "muhurat" | "auspicious" | "ekadashi" | "purnima" | "amavasya";

export interface IFestivalCalendar extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  date: Date;
  endDate?: Date;
  type: FestivalType;
  isRecurring: boolean;
  recurrencePattern?: string;
  suggestedPujas: mongoose.Types.ObjectId[];
  isAuspicious: boolean;
  timing?: string;
  nakshatra?: string;
  tithi?: string;
  importance?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FestivalCalendarSchema = new Schema<IFestivalCalendar>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    date: { type: Date, required: true },
    endDate: { type: Date },
    type: {
      type: String,
      enum: ["festival", "muhurat", "auspicious", "ekadashi", "purnima", "amavasya"],
      default: "festival",
    },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String },
    suggestedPujas: [{ type: Schema.Types.ObjectId, ref: "Puja" }],
    isAuspicious: { type: Boolean, default: true },
    timing: { type: String },
    nakshatra: { type: String },
    tithi: { type: String },
    importance: { type: String },
  },
  { timestamps: true }
);

FestivalCalendarSchema.index({ date: 1 });
FestivalCalendarSchema.index({ type: 1 });

const FestivalCalendar: Model<IFestivalCalendar> =
  mongoose.models.FestivalCalendar ||
  mongoose.model<IFestivalCalendar>("FestivalCalendar", FestivalCalendarSchema);

export default FestivalCalendar;
