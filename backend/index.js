import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port " + PORT);
});
