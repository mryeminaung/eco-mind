import mongoose, { Schema } from "mongoose";

export type CollectionRequestStatus = "PENDING" | "ACCEPTED" | "COLLECTED" | "COMPLETED" | "REJECTED";

const CollectionRequestSchema = new Schema(
  {
    userId: { type: String, required: true, trim: true },
    recyclerId: { type: String, default: null, trim: true },
    material: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true }, // e.g. "15 kg", "3 bags" or numeric
    address: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "COLLECTED", "COMPLETED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    acceptedAt: { type: String },
    collectedAt: { type: String },
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

export const CollectionRequestModel =
  mongoose.models.CollectionRequest ||
  mongoose.model("CollectionRequest", CollectionRequestSchema);
