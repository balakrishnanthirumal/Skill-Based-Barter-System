import express from "express";
import {
  createUser,
  getAllUsers,
  getCurrentUserProfile,
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

export default router;
