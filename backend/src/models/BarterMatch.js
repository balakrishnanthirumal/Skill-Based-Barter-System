import mongoose from "mongoose";

const barterMatchSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarterRequest",
      required: true,
    },
    matchedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchedOn: { type: Date, default: Date.now }, // ✅ fixed
  },
  { timestamps: true }
);

export const BarterMatch = mongoose.model("BarterMatch", barterMatchSchema);
