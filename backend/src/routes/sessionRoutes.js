import express from "express";
import {
  createSession,
  getUserSessions,
  startSession,
  endSession,
  cancelSession,
} from "../controllers/sessionController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, createSession);

router.get("/", authenticate, getUserSessions);

router.put("/:id/start", authenticate, startSession);

router.put("/:id/end", authenticate, endSession);

router.put("/:id/cancel", authenticate, cancelSession);

export default router;
