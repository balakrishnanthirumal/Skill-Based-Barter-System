import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    totalHourOfTeaching: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
