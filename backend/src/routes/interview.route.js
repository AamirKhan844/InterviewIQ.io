import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { analyseResume } from "../controllers/interview.controller.js";
const router = express.Router();
router.post("/resume", isAuth, upload.single("resume"), analyseResume);
export default router;
