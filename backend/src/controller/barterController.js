import { BarterRequest } from "../models/barterRequest.js";
import { BarterMatch } from "../models/barterMatch.js";
import { UserSkill } from "../models/userSkills.js";
import { Session } from "../models/session.js";
import { User } from "../models/users.js";

// ✅ Helper: Generate unique Jitsi link
function generateJitsiLink(sessionId) {
  return `https://meet.jit.si/barter-${sessionId}-${Date.now()}`;
}

// ✅ 1. Create Barter Request & Attempt Match
export const createBarterRequest = async (req, res) => {
  try {
    const { skillOfferedId, skillWantId } = req.body;
    const userId = req.user._id;

    // Create new barter request
    const request = await BarterRequest.create({
      userId,
      skillOfferedId,
      skillWantId,
      status: "OPEN",
    });

    // 🔍 Find potential matches
    const potentialMatches = await BarterRequest.find({
      skillOfferedId: skillWantId,
      skillWantId: skillOfferedId,
      status: "OPEN",
      userId: { $ne: userId },
    }).populate("userId");

    // If there are no matches
    if (potentialMatches.length === 0) {
      return res.status(201).json({
        message: "No direct match found. Request saved for future matching.",
        request,
      });
    }

    // 🧠 Sort matches by user rating (highest first)
    potentialMatches.sort((a, b) => b.userId.rating - a.userId.rating);
    const matchedRequest = potentialMatches[0];

    // Update both requests
    request.status = "MATCHED";
    matchedRequest.status = "MATCHED";
    await request.save();
    await matchedRequest.save();

    // Create barter match record
    const barterMatch = await BarterMatch.create({
      requestId: request._id,
      matchedUser: matchedRequest.userId._id,
      matchedOn: new Date(),
    });

    // Automatically create a session (default: +1 day)
    const scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await Session.create({
      scheduledTime,
      durationMinutes: 60,
      meetingLink: generateJitsiLink(request._id),
      hostUser: userId,
      guestUser: matchedRequest.userId._id,
      status: "PENDING",
    });

    // ✅ Remove the completed skills from both users’ lists (optional)
    // await UserSkill.deleteOne({ userId, skillsId: skillOfferedId });
    // await UserSkill.deleteOne({ userId: matchedRequest.userId._id, skillsId: skillWantId });

    return res.status(201).json({
      message: "Barter match found (based on rating) and session created!",
      barterMatch,
      session,
    });
  } catch (error) {
    console.error("Error creating barter request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ 2. Get All Barter Requests
export const getAllBarterRequests = async (req, res) => {
  try {
    const requests = await BarterRequest.find()
      .populate("userId")
      .populate("skillOfferedId")
      .populate("skillWantId");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching barter requests", error });
  }
};

// ✅ 3. Recommend Users based on skill preferences
export const recommendMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    const teachSkills = await UserSkill.find({
      userId,
      type: "CAN_TEACH",
    }).populate("skillsId");
    const learnSkills = await UserSkill.find({
      userId,
      type: "WANT_TO_LEARN",
    }).populate("skillsId");

    // Find users who want to learn what you can teach
    const teachSkillIds = teachSkills.map((s) => s.skillsId._id);
    const learnSkillIds = learnSkills.map((s) => s.skillsId._id);

    const potentialTeachers = await UserSkill.find({
      skillsId: { $in: learnSkillIds },
      type: "CAN_TEACH",
      userId: { $ne: userId },
    })
      .populate("userId")
      .populate("skillsId");

    const potentialLearners = await UserSkill.find({
      skillsId: { $in: teachSkillIds },
      type: "WANT_TO_LEARN",
      userId: { $ne: userId },
    })
      .populate("userId")
      .populate("skillsId");

    const recommendations = {};

    potentialTeachers.forEach((t) => {
      if (!recommendations[t.userId._id])
        recommendations[t.userId._id] = {
          user: t.userId,
          teaches: [],
          learns: [],
        };
      recommendations[t.userId._id].teaches.push(t.skillsId.name);
    });

    potentialLearners.forEach((l) => {
      if (!recommendations[l.userId._id])
        recommendations[l.userId._id] = {
          user: l.userId,
          teaches: [],
          learns: [],
        };
      recommendations[l.userId._id].learns.push(l.skillsId.name);
    });

    res.json({
      message: "Recommended matches",
      data: Object.values(recommendations),
    });
  } catch (error) {
    console.error("Error in recommendation:", error);
    res
      .status(500)
      .json({ message: "Error generating recommendations", error });
  }
};
