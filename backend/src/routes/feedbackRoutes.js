import express from "express";
import {
  giveFeedback,
  getFeedbackForUser,
} from "../controllers/feedbackController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, giveFeedback);
router.get("/:userId", authenticate, getFeedbackForUser);

export default router;
