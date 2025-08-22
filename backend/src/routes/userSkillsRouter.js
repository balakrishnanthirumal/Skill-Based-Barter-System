import express from "express";
import {
  addUserSkill,
  deleteUserSkill,
  getAllUserSkills,
  getUserSkills,
} from "../controller/userSkillController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, addUserSkill)
  .get(authenticate, getAllUserSkills);
router.route("/user").get(authenticate, getUserSkills);
router.route("/user/:id").delete(authenticate, deleteUserSkill);

export default router;
