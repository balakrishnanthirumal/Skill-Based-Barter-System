import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  scheduledTime: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 }, // planned duration
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
    enum: ["PENDING", "ONGOING", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  startTime: { type: Date }, // 🕒 when session actually started
  endTime: { type: Date }, // 🕓 when it ended
  actualDurationMinutes: { type: Number, default: 0 }, // 🧮 real teaching time
});

export const Session = mongoose.model("Session", sessionSchema);
