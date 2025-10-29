import { BarterRequest } from "../models/barterRequest.js";
import { Session } from "../models/session.js";
import { UserSkill } from "../models/userSkills.js";

export const createSession = async (req, res) => {
  try {
    const { scheduledTime, durationMinutes, hostUser, guestUser } = req.body;

    const session = await Session.create({
      scheduledTime,
      durationMinutes: durationMinutes || 60,
      meetingLink: `https://meet.jit.si/barter-${Date.now()}`,
      hostUser,
      guestUser,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Error creating session", error });
  }
};

export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      $or: [{ hostUser: userId }, { guestUser: userId }],
    })
      .populate("hostUser", "username email rating")
      .populate("guestUser", "username email rating");

    res.status(200).json({
      message: "Fetched user sessions successfully",
      sessions,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Error fetching sessions", error });
  }
};

export const startSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndUpdate(
      id,
      { status: "ONGOING", startTime: new Date() },
      { new: true }
    );

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.json({
      message: "Session started successfully",
      session,
    });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ message: "Error starting session", error });
  }
};

export const endSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const endTime = new Date();
    const durationMinutes = Math.round(
      (endTime - new Date(session.startTime)) / 60000
    );

    session.status = "COMPLETED";
    session.endTime = endTime;
    session.actualDurationMinutes = durationMinutes;
    await session.save();

    const hostUserId = session.hostUser;
    const guestUserId = session.guestUser;

    const barterRequest = await BarterRequest.findOne({
      userId: hostUserId,
      status: "MATCHED",
    });

    if (barterRequest) {
      const { skillOfferedId, skillWantId } = barterRequest;

      // Remove corresponding skills for both users
      await UserSkill.deleteOne({
        userId: hostUserId,
        skillsId: skillOfferedId,
        type: "CAN_TEACH",
      });

      await UserSkill.deleteOne({
        userId: guestUserId,
        skillsId: skillWantId,
        type: "WANT_TO_LEARN",
      });
    }

    res.json({
      message: "Session ended successfully",
      session,
    });
  } catch (error) {
    console.error("Error ending session:", error);
    res.status(500).json({ message: "Error ending session", error });
  }
};

export const cancelSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndUpdate(
      id,
      { status: "CANCELLED" },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: "Session not found" });

    res.json({
      message: "Session cancelled successfully",
      session,
    });
  } catch (error) {
    console.error("Error cancelling session:", error);
    res.status(500).json({ message: "Error cancelling session", error });
  }
};
