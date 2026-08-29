import mongoose, { Schema } from "mongoose";

const CommunityEventSchema = new Schema(
  {
    title: { type: String, required: true },
    organizer: { type: String, required: true },
    city: {
      type: String,
      enum: ["Yangon", "Mandalay", "Naypyidaw", "Bago", "Mawlamyine", "Taunggyi"],
      required: true,
    },
    township: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    participantsCount: { type: Number, default: 0 },
    targetWasteType: { type: String, required: true },
    description: { type: String, required: true },
    badgeAward: { type: String, required: true },
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

export const CommunityEventModel =
  mongoose.models.CommunityEvent ||
  mongoose.model("CommunityEvent", CommunityEventSchema);
