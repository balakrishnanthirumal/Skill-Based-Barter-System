import { Skill } from "../models/skills.js";
import Fuse from "fuse.js";

// Create Skill
export const createSkill = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Skill name is required" });
    }

    name = name.trim().toLowerCase();

    const existingSkills = await Skill.find();
    const skillNames = existingSkills.map((s) => s.name.toLowerCase());

    const fuse = new Fuse(skillNames, {
      includeScore: true,
      threshold: 0.4, // lower = stricter (0.0 = exact match, 1.0 = everything is a match)
    });

    const results = fuse.search(name);

    if (results.length > 0 && results[0].score <= 0.4) {
      // Found a close match
      return res.status(409).json({
        message: `Similar skill already exists: "${results[0].item}"`,
      });
    }

    const newSkill = new Skill({ name });
    await newSkill.save();

    res.status(201).json(newSkill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const skills = await Skill.find({ _id: id });
    res.status(200).json(skills);
  } catch (err) {
    res.status(404).json({ message: "Skill not found" });
  }
};
