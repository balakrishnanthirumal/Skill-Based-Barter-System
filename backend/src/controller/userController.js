import { User } from "../models/users.js";
import bcrypt from "bcryptjs";
import createToken from "../lib/createToken.js";
import asyncHandler from "../lib/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, department, rollNumber } = req.body;

  if (!username || !password || !email || !department || !rollNumber) {
    throw new Error("Please fill all the fields");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existingUser = await User.findOne({ email });
  const existingRoll = await User.findOne({ rollNumber });
  if (existingUser || existingRoll) {
    res.status(400);
    throw new Error("User already exists");
  } else {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      department,
      rollNumber,
      bio: null,
    });

    try {
      await newUser.save();
      createToken(res, newUser._id);

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        department,
        rollNumber,
        rating: newUser.rating,
        bio: newUser.bio,
      });
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        department: existingUser.department,
        rollNumber: existingUser.rollNumber,
        bio: existingUser.bio,
      });
      return;
    }
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      rollNumber: user.rollNumber,
      department: user.department,
      bio: null,
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      department: updatedUser.department,
      rollNumber: updatedUser.rollNumber,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  getUserById,
  updateUserById,
  getAllUsers,
};
