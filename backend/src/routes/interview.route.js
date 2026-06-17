import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  analyseResume,
  finishInterview,
  generateQuestions,
  getInterviewReport,
  getMyIntreviews,
  submitAnswer,
} from "../controllers/interview.controller.js";
const router = express.Router();
router.post("/resume", isAuth, upload.single("resume"), analyseResume);
router.post("/generate-questions", isAuth, generateQuestions);
router.post("/submit-answer", isAuth, submitAnswer);
router.post("/finish", isAuth, finishInterview);
router.get("/interviews", isAuth, getMyIntreviews);
router.get("/report/:id", isAuth, getInterviewReport);
export default router;
