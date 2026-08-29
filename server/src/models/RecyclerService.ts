import mongoose, { Schema } from "mongoose";

const RecyclerServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    nameMyanmar: { type: String },
    type: {
      type: String,
      enum: ["collector", "drop_off_center", "social_enterprise", "scrap_dealer"],
      default: "collector",
    },
    city: {
      type: String,
      enum: ["Yangon", "Mandalay", "Naypyidaw", "Bago", "Mawlamyine", "Taunggyi"],
      required: true,
    },
    townshipsCovered: [{ type: String }],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    acceptedMaterials: [{ type: String }],
    minimumWeightKg: { type: Number, default: 5 },
    paysForScrap: { type: Boolean, default: true },
    ratePerKg: { type: Map, of: Number },
    operatingHours: { type: String, default: "Mon - Sat: 8:00 AM - 5:00 PM" },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    description: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const RecyclerModel =
  mongoose.models.RecyclerService ||
  mongoose.model("RecyclerService", RecyclerServiceSchema);
