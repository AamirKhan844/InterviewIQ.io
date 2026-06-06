import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  analyseResume,
  finishInterview,
  generateQuestions,
  submitAnswer,
} from "../controllers/interview.controller.js";
const router = express.Router();
router.post("/resume", isAuth, upload.single("resume"), analyseResume);
router.post("/generate-questions", isAuth, generateQuestions);
router.post("/submit-answer", isAuth, submitAnswer);
router.post("/finish", isAuth, finishInterview);
export default router;
