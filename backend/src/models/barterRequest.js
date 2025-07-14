import mongoose from "mongoose";

const barterRequestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillOfferedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    skillWantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    status: {
      enum: ["OPEN", "MATCHED", "CLOSED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  }
);

export const BarterRequest = mongoose.model(
  "BarterRequest",
  barterRequestSchema
);
