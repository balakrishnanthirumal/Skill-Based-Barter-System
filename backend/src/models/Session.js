import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  scheduledTime: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  meetingLink: { type: String, required: true },
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
    type: String,
    enum: ["PENDING", "CONFIRMED", "ONGOING", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  hostAccepted: { type: Boolean, default: false },
  guestAccepted: { type: Boolean, default: false },
  startTime: { type: Date },
  endTime: { type: Date },
  actualDurationMinutes: { type: Number, default: 0 },
});

export const Session = mongoose.model("Session", sessionSchema);
