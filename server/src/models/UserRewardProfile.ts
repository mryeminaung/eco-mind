import mongoose from "mongoose";

const PointsTransactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    requestId: { type: String, required: true },
    userId: { type: String, required: true },
    material: { type: String, required: true },
    materialCategory: { type: String, required: true },
    quantity: { type: String, required: true },
    weightKg: { type: Number, required: true },
    ratePerKg: { type: Number, required: true },
    pointsEarned: { type: Number, required: true },
    environmentalImpact: {
      landfillSavedKg: { type: Number, default: 0 },
      co2SavedKg: { type: Number, default: 0 },
      treesSaved: { type: Number, default: 0 },
      waterSavedLiters: { type: Number, default: 0 },
      summaryStatement: { type: String, default: "" },
    },
    timestamp: { type: String, required: true },
  },
  { _id: false }
);

const UserRewardProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "Citizen User" },
    totalPoints: { type: Number, default: 0 },
    itemsRecycledCount: { type: Number, default: 0 },
    totalWeightKg: { type: Number, default: 0 },
    materialBreakdown: {
      plasticKg: { type: Number, default: 0 },
      paperKg: { type: Number, default: 0 },
      glassKg: { type: Number, default: 0 },
      metalKg: { type: Number, default: 0 },
      otherKg: { type: Number, default: 0 },
    },
    pointsBreakdown: {
      plasticPoints: { type: Number, default: 0 },
      paperPoints: { type: Number, default: 0 },
      glassPoints: { type: Number, default: 0 },
      metalPoints: { type: Number, default: 0 },
      otherPoints: { type: Number, default: 0 },
    },
    environmentalImpact: {
      landfillSavedKg: { type: Number, default: 0 },
      co2SavedKg: { type: Number, default: 0 },
      treesSaved: { type: Number, default: 0 },
      waterSavedLiters: { type: Number, default: 0 },
      summaryStatement: { type: String, default: "" },
    },
    transactions: [PointsTransactionSchema],
  },
  { timestamps: true }
);

export const UserRewardProfileModel =
  mongoose.models.UserRewardProfile ||
  mongoose.model("UserRewardProfile", UserRewardProfileSchema);
