import { FeedBack } from "../models/feedback.js";
import { User } from "../models/users.js";
import { Session } from "../models/session.js";

// Give feedback after a completed session
export const giveFeedback = async (req, res) => {
  try {
    const { sessionId, givenTo, rating, comment } = req.body;
    const givenBy = req.user._id; // from auth middleware

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only allow feedback if session is completed
    if (session.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ message: "Feedback allowed only after session completion" });
    }

    // Prevent duplicate feedback
    const existing = await FeedBack.findOne({ sessionId, givenBy });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already submitted feedback for this session" });
    }

    // Create feedback
    const feedback = await FeedBack.create({
      sessionId,
      givenBy,
      givenTo,
      rating,
      comment,
    });

    // Update the average rating of the user who received feedback
    const allFeedbacks = await FeedBack.find({ givenTo });
    const avgRating =
      allFeedbacks.reduce((acc, f) => acc + f.rating, 0) / allFeedbacks.length;

    await User.findByIdAndUpdate(givenTo, { rating: avgRating.toFixed(1) });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback", error });
  }
};

// Get all feedback received by a user
export const getFeedbackForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await FeedBack.find({ givenTo: userId })
      .populate("givenBy", "username department")
      .populate("sessionId", "scheduledTime durationMinutes status");

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};
