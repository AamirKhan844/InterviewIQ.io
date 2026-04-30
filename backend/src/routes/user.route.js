import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
const router = express.Router();
router.get("/current-user", isAuth, getCurrentUser);
export default router;
