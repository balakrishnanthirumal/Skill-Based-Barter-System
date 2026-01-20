import { UserSkill } from "../models/UserSkills.js";

const addUserSkill = async (req, res) => {
  try {
    const { skillsId, type } = req.body;

    // Check if user already has this skill
    const exists = await UserSkill.findOne({
      userId: req.user._id,
      skillsId,
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Skill already added for user", userSkill: exists });
    }

    // Add skill for user
    const userSkill = new UserSkill({ userId: req.user._id, skillsId, type });
    await userSkill.save();

    res
      .status(201)
      .json({ message: "User skill added successfully", userSkill });
  } catch (error) {
    res.status(500).json({ message: "Error adding user skill", error });
  }
};

const getUserSkills = async (req, res) => {
  try {
    const skills = await UserSkill.find({ userId: req.user._id }).populate(
      "skillsId",
    );
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user skills", error });
  }
};

const getAllUserSkills = async (req, res) => {
  try {
    const skills = await UserSkill.find()
      .populate("userId") // populates entire User object
      .populate("skillsId"); // populates entire Skill object

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user skills", error });
  }
};
const deleteUserSkill = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await UserSkill.findByIdAndDelete(id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    res.status(404).json({ message: "Skill is not found" });
  }
};
export const updateUserSkillsProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { teachSkills = [], learnSkills = [] } = req.body;

    // ❌ Remove existing skills for user
    await UserSkill.deleteMany({ userId });

    const newSkills = [];

    // ✅ Add CAN_TEACH skills
    teachSkills.forEach((skillId) => {
      newSkills.push({
        userId,
        skillsId: skillId,
        type: "CAN_TEACH",
      });
    });

    // ✅ Add WANT_TO_LEARN skills
    learnSkills.forEach((skillId) => {
      newSkills.push({
        userId,
        skillsId: skillId,
        type: "WANT_TO_LEARN",
      });
    });

    // Insert all at once
    if (newSkills.length > 0) {
      await UserSkill.insertMany(newSkills);
    }

    res.status(200).json({
      message: "Profile skills updated successfully",
      teachSkillsCount: teachSkills.length,
      learnSkillsCount: learnSkills.length,
    });
  } catch (error) {
    console.error("Update skills error:", error);
    res.status(500).json({
      message: "Failed to update user skills",
      error,
    });
  }
};

export { getUserSkills, addUserSkill, getAllUserSkills, deleteUserSkill };
