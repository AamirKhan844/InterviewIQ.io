import fs from "fs";
import * as pdfjslib from "pdfjs-dist/legacy/build/pdf.min.mjs";
import { askAi } from "../../services/openRouter.services.js";
import { User } from "../models/user.model.js";
import { Interview } from "../models/interview.model.js";
export const analyseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume is Required",
        success: false,
      });
    }
    const filePath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filePath);
    const uInt8Array = new Uint8Array(fileBuffer);
    const pdf = await pdfjslib.getDocument({ data: uInt8Array }).promise;

    let resumeText = "";
    //extract text from all the pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }
    // resumeText = resumeText.replace(/\s+/g, "").trim();
    resumeText = resumeText.replace(/\s+/g, "").trim();
    const messages = [
      {
        role: "system",
        content: `
            Extract structured data from the Resume.
            Also return Experience. If No experience is found. Calculate the number of years user has worked in all the companies
            Return strictly JSON:
            {
            "role":"string",
            "Experience":"string",
            "projects":["project1","project2"],
            "skills":["skill1","skill2"]
            }
            `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];
    const aiResponse = await askAi(messages);
    const cleanResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(cleanResponse);

    const parsed = JSON.parse(cleanResponse);
    fs.unlinkSync(filePath);
    res.json({
      role: parsed.role,
      experience: parsed.experience || parsed.Experience,
      skills: parsed.skills,
      projects: parsed.projects,
      resumeText,
    });
  } catch (error) {
    console.log(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
  res.status(500).json({
    message: "internal server error",
    success: false,
  });
};

export const generateQuestions = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;
    console.log(role, experience, mode);
    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();
    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "Role, Experience & mode are Required. ",
        success: false,
      });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enogh credits!  Minimum 50 Credits Required!",
        success: false,
      });
    }
    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(",") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(",") : "None";
    const safeResume = resumeText.trim() || "None";
    const userPrompt = `
    Role: ${role}
    Experience: ${experience}
    InterviewMode: ${mode}
    Projects: ${projectText}
    Skills: ${skillsText}
    Resume: ${safeResume}
    `;
    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is Empty",
      });
    }
    const messages = [
      {
        role: "system",
        content: `
        You are real human interviewer conducting a Professional Interview.
        Speak in simple, natural English as if you are  directly talking to the candidate.
        Generate Exactly five interview questions.
        Strict Rules: 
        - Each Questions must contain between 15 to 20 words.
        - Each Questions must be a Single complete Sentence.
        - Do not number them.
        - Do not add explanations.
        - Do not add extra Text before or after.
        - One questions per line only.
        - Keep languange simple and conversational.
        - Questions must feel practical and Relaistic.

        Difficulty Progression
        Question 1 -> Easy
        Question 2 -> Easy
        Questions 3-> medium
        Question 4-> medium
        Question 5-> hard
        Mae questions based on the candidate's role, experience, interviewMode, projects, skill, and Resume details

        `,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];
    const aiResponse = await askAi(messages);
    if (!aiResponse || !aiResponse.trim()) {
      return res.status(400).json({
        message: "AI returned Empty Response",
      });
    }
    const questionArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);
    if (questionArray.length === 0) {
      return res.status(500).json({
        message: "AI Failed to generate questions",
      });
    }
    user.credits -= 50;
    await user.save();
    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });
    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// export const submitAnswer = async (req, res) => {
//   try {
//     const { interviewId, questionIndex, answer, timeTaken } = req.body;
//     const interview = await Interview.findById(interviewId);
//     const question = interview.questions[questionIndex];
//     if (!answer) {
//       question.score = 0;
//       question.feedback = "You did not submit an answer";
//       question.answer = "";
//       await interview.save();
//     }
//     res.json({
//       feedback: question.feedback,
//     });
//     if (timeTaken > question.timeLimit) {
//       question.score = 0;
//       question.feedback = "Time Limit Exceed. Question not evaluated";
//       await Interview.save();
//     }
//     return res.json({
//       feedback: question.feedback,
//     });
//     const messages = [
//       {
//         role: "system",
//         content: `
//         You are a professional human interviewer evaluating a candiadte's answer in real interview.

//         Evaluate narturally and fairly like a real person would.

//         Score the answer in these areas (0 to 10):

//         1. Confidence - Does the answer sound, clear , confident and  well presented?
//         2. Comminication - Is the  Language simple, clear, and Easy to understand?
//         3. Correctness - Is  the answer accurate,  relevant and complete?

//         Rules:
//         1. Be Realistic and unbiased.
//         2. Do not give Random  high Scores.
//         3. If the answer is weak, score low.
//         4. If the answer is  strong and Detailed, score  high.
//         5.  Consider clarity, Structure and relevance

//         Calculate:
//         finalScore= average of confidence, communication, and correctness (rounded to nearest whole Number).

//         Feeback Rules:
//         - Write Natural human feedback.
//         - 10 to 15 words only.
//         - Sound like real Interview Feedback.
//         - Can Suggest improvement if needed.
//         - DO not repeat the Question.
//         - Do not explain Scoring.
//         - Keep tone professional and honest.

//         Return only Valid json in this format:
//       {
//         "confidence":number,
//         "communication":number,
//         "correctness":number,
//         "finalScore":number,
//         "feedback":"short human feedback"
//       }
//         `,
//       },
//       {
//         role: "user",
//         content: `
//         Question :${question.question}
//         Answer:${answer}
//         `,
//       },
//     ];
//     const aiResponse = await askAi(messages);
//     const cleanResponse = aiResponse
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const parsed = JSON.parse(cleanResponse);
//     console.log(parsed);
//     question.answer = answer;
//     question.confidence = parsed.confidence;
//     question.communication = parsed.communication;
//     question.correctness = parsed.correctness;
//     question.score = parsed.finalScore;
//     question.feedback = parsed.feedback;
//     await interview.save();
//     return res.status(200).json({
//       feedback: parsed.feedback,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `failed to submit answer ${error}`,
//     });
//   }
// };

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const question = interview.questions[questionIndex];

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Empty answer
    if (!answer || answer.trim() === "") {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = "You did not submit an answer";
      question.answer = "";

      await interview.save();

      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    // Time limit exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = "Time limit exceeded. Question not evaluated.";
      question.answer = answer;

      await interview.save();

      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    // AI Evaluation
    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer.

Evaluate on a scale of 0-10:

1. Confidence
2. Communication
3. Correctness

Calculate:
finalScore = average of confidence, communication and correctness.

Return ONLY valid JSON:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
        `,
      },
      {
        role: "user",
        content: `
Question: ${question.question}

Answer: ${answer}
        `,
      },
    ];

    const aiResponse = await askAi(messages);

    console.log("Raw AI Response:", aiResponse);

    const cleanResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanResponse);

    console.log("Parsed Response:", parsed);

    question.answer = answer;
    question.confidence = Number(parsed.confidence) || 0;
    question.communication = Number(parsed.communication) || 0;
    question.correctness = Number(parsed.correctness) || 0;
    question.score = Number(parsed.finalScore) || 0;
    question.feedback = parsed.feedback || "";

    await interview.save();

    console.log("Saved Question:", JSON.stringify(question, null, 2));

    return res.status(200).json({
      success: true,
      feedback: question.feedback,
      score: question.score,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);

    return res.status(500).json({
      success: false,
      message: `Failed to submit answer: ${error.message}`,
    });
  }
};
export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(400).json({
        message: "failed to find Interview",
        success: false,
      });
    }
    const totalQuestions = interview.questions.length;
    let totalScore = 0;
    let totalConfidence = 0;
    let totalCorrectness = 0;
    let totalCommunication = 0;
    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });
    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;
    interview.finalScore = finalScore;
    interview.status = "Completed";
    await interview.save();
    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      comminication: Number(avgCommunication.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        correctness: q.correctness || 0,
        feedback: q.feedback || "",
        communication: q.communication || 0,
        confidence: q.confidence || 0,
      })),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// export const getMyIntreviews = async (req, res) => {
//   try {
//     const interviews = await Interview.find({ userId: req.userId })
//       .sort({
//         createdAt: -1,
//       })
//       .select("role experience mode finalScore status createdAt");
//     console.log(interviews);
//     return res.status(200).json({
//       intreviews,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `failed to find current user Interview ${error}`,
//     });
//   }
// };

export const getMyIntreviews = async (req, res) => {
  try {
    console.log("User ID:", req.userId);

    const interviews = await Interview.find({
      userId: req.userId,
    })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    // console.log("Found Interviews:", interviews);

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("GET INTERVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// export const getInterviewReport = async (req, res) => {
//   try {
//     const interview = await Intreview.findById(req.params.id);
//     console.log(interview);
//     if (!interview) {
//       return res.status(404).json({
//         message: "Intreview not found",
//         success: false,
//       });
//     }
//     const totalQuestions = interview.questions.length;
//     let totalConfidence = 0;
//     let totalCorrectness = 0;
//     let totalCommunication = 0;
//     interview.questions.forEach((q) => {
//       totalConfidence += q.confidence || 0;
//       totalCommunication += q.communication || 0;
//       totalCorrectness += q.correctness || 0;
//     });
//     const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
//     const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
//     const avgCommunication = totalQuestions
//       ? totalCommunication / totalQuestions
//       : 0;
//     const avgCorrectness = totalQuestions
//       ? totalCorrectness / totalQuestions
//       : 0;
//     interview.finalScore = finalScore;
//     interview.status = "completed";
//     await interview.save();
//     return res.status(200).json({
//       finalScore: Number(finalScore.toFixed(1)),
//       confidence: Number(avgConfidence.toFixed(1)),
//       correctness: Number(avgCorrectness.toFixed(1)),
//       comminication: Number(avgCommunication.toFixed(1)),
//       questionWiseScore: interview.questions.map((q) => ({
//         question: q.question,
//         score: q.score || 0,
//         correctness: q.correctness || 0,
//         feedback: q.feedback || "",
//         communication: q.communication || 0,
//         confidence: q.confidence || 0,
//       })),
//     });
//   } catch (error) {
//     // console.log( )
//     return res.status(500).json({
//       message: `failed to find current Interview ${error.message}`,
//     });
//   }
// };

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
        success: false,
      });
    }

    const totalQuestions = interview.questions?.length || 0;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCorrectness = 0;
    let totalCommunication = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "Completed";

    await interview.save();

    return res.status(200).json({
      success: true,
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        correctness: q.correctness || 0,
        feedback: q.feedback || "",
        communication: q.communication || 0,
        confidence: q.confidence || 0,
      })),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
