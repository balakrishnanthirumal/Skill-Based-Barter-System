import mongoose from "mongoose";

const session = mongoose.Schema(
  {
    scheduledTime: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    meetingLink: String,
    hostUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guestUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
    },
    startedAt: Date,
    endedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model("Session", session);
