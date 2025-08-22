import express from "express";
import {
  createSkill,
  findSkillById,
  getSkills,
} from "../controller/skillsController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.route("/").post(authenticate, createSkill).get(authenticate, getSkills);
router.route("/:id").get(findSkillById);

export default router;
