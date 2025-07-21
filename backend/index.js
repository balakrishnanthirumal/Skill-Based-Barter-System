import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port " + PORT);
});
