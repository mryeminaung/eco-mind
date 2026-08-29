import mongoose, { Schema } from "mongoose";

const DropOffHubSchema = new Schema(
  {
    name: { type: String, required: true },
    locationName: { type: String, required: true },
    city: {
      type: String,
      enum: ["Yangon", "Mandalay", "Naypyidaw", "Bago", "Mawlamyine", "Taunggyi"],
      required: true,
    },
    township: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    acceptedMaterials: [{ type: String }],
    operatingHours: { type: String, default: "8:00 AM - 6:00 PM" },
    hasRewardKiosk: { type: Boolean, default: false },
    contactNumber: { type: String, required: true },
    managedBy: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "closed", "maintenance"],
      default: "open",
    },
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

export const DropOffHubModel =
  mongoose.models.DropOffHub ||
  mongoose.model("DropOffHub", DropOffHubSchema);
