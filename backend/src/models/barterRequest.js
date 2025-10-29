import mongoose from "mongoose";

const barterRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
    type: String,
    enum: ["OPEN", "MATCHED", "CLOSED"],
    default: "OPEN",
  }, // ✅ fix
});

export const BarterRequest = mongoose.model(
  "BarterRequest",
  barterRequestSchema
);
