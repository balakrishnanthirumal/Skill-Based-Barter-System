import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import skillsRoute from "./src/routes/skillsRoute.js";
import userSkillsRoute from "./src/routes/userSkillsRouter.js";
import barterRoute from "./src/routes/barterRoutes.js";
import sessionRoute from "./src/routes/sessionRoutes.js";
import feedbackRoute from "./src/routes/feedbackRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/skills", skillsRoute);
app.use("/api/userskills", userSkillsRoute);
app.use("/api/barter", barterRoute);
app.use("/api/session", sessionRoute);
app.use("/api/feedback", feedbackRoute);

connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
