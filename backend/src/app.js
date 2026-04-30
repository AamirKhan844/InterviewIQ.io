import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "working fine",
    success: true,
  });
});

app.use("/api/v1/user/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
