import fs from "fs";
import * as pdfjslib from "pdfjs-dist/legacy/build/pdf.min.mjs";
import { askAi } from "../../services/openRouter.services.js";
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
