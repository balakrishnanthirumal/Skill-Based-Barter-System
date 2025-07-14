import mongoose from "mongoose";

const userSkillSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    type: {
      status: String,
      enum: ["CAN_TEACH", "WANT_TO_LEARN"],
    },
  },
  {
    timestamps: true,
  }
);

export const UserSkill = mongoose.model("UserSkill", userSkillSchema);
