import express from "express";
import {
  giveFeedback,
  getFeedbackForUser,
} from "../controller/feedbackController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, giveFeedback);
router.get("/", authenticate, getFeedbackForUser);

export default router;
