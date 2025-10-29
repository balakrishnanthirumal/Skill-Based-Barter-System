import express from "express";
import {
  createBarterRequest,
  getAllBarterRequests,
  recommendMatches,
} from "../controller/barterController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/create", authenticate, createBarterRequest);
router.get("/all", authenticate, getAllBarterRequests);
router.get("/recommend", authenticate, recommendMatches);

export default router;
