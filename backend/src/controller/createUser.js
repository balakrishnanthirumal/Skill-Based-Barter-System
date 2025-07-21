import User from "../models/users.js";
import bcrypt from "bcryptjs";
import createToken from "../lib/createToken.js";
import asyncHandler from "../lib/asyncHandler.js";

const create = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    throw new Error("Please find all the fields");

  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existingUser = await User.findOne({email});
  if(existingUser){
    res.status(400);
    throw new Error("User already exists");
    
  }
  else{
    const newUser = new User({
        username,
        email, 
        password: hashedPassword
    })
  }

});
