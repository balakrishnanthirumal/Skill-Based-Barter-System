import mongoose from "mongoose";

const barterMatchSchema = mongoose.Schema(
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
    matchedOn: Date.now(),
  },
  {
    timestamps: true,
  }
);

export const BarterMatch = mongoose.model("BarterMatch", barterMatchSchema);
