import { UserSkill } from "../models/userSkills.js";

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
      "skillsId"
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

export { getUserSkills, addUserSkill, getAllUserSkills, deleteUserSkill };
