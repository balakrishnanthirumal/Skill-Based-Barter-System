import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import skillsRoute from "./src/routes/skillsRoute.js";
import userSkillsRoute from "./src/routes/userSkillsRouter.js";
import barterRoute from "./src/routes/barterRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/skills", skillsRoute);
app.use("/api/userskills", userSkillsRoute);
app.use("/api/barter", barterRoute);

connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
