import mongoose, { Schema } from "mongoose";

const RecyclingCenterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    acceptedMaterials: [{ type: String, required: true, trim: true }],
    phone: { type: String, required: true, trim: true },
    openingHours: { type: String, required: true, trim: true },
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

export const RecyclingCenterModel =
  mongoose.models.RecyclingCenter ||
  mongoose.model("RecyclingCenter", RecyclingCenterSchema);
