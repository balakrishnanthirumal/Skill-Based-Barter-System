import express from "express";
import {
  createUser,
  getAllUsers,
  getCurrentUserProfile,
  getDashboardData,
  loginUser,
  logoutCurrentUser,
  updateUserById,
} from "../controller/userController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.route("/").post(createUser).get(authenticate, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateUserById);
router.get("/data", authenticate, getDashboardData);

export default router;
