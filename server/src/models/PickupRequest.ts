import mongoose, { Schema } from "mongoose";

const WasteItemDetailSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["plastic", "paper", "electronic", "metal", "glass", "organic", "textile"],
      required: true,
    },
    estimatedWeightKg: { type: Number, required: true },
    description: { type: String },
  },
  { _id: false }
);

const PickupRequestSchema = new Schema(
  {
    citizenName: { type: String, required: true },
    citizenPhone: { type: String, required: true },
    city: {
      type: String,
      enum: ["Yangon", "Mandalay", "Naypyidaw", "Bago", "Mawlamyine", "Taunggyi"],
      required: true,
    },
    township: { type: String, required: true },
    address: { type: String, required: true },
    items: [WasteItemDetailSchema],
    totalEstimatedWeightKg: { type: Number, required: true },
    preferredDate: { type: String, required: true },
    preferredTimeSlot: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      default: "morning",
    },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_transit", "completed", "cancelled"],
      default: "pending",
    },
    assignedCollectorId: { type: String },
    assignedCollectorName: { type: String },
    actualWeightKg: { type: Number },
    ecoPointsEarned: { type: Number, default: 0 },
    rewardMmk: { type: Number, default: 0 },
    completedAt: { type: String },
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

export const PickupModel =
  mongoose.models.PickupRequest ||
  mongoose.model("PickupRequest", PickupRequestSchema);
