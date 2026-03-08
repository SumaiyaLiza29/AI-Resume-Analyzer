import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractText(file) {
  const { mimetype, buffer, originalname } = file;

  // Handle PDF files
if (mimetype === "application/pdf" || originalname.toLowerCase().endsWith(".pdf")) {
    const PDFParser = (await import("pdf2json")).default;
    
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfData.Pages
          .map(page => page.Texts
            .map(t => decodeURIComponent(t.R.map(r => r.T).join("")))
            .join(" ")
          )
          .join("\n");
        resolve(text.trim());
      });
      
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.parseBuffer(buffer);
    });
}
  // Handle DOCX files
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    originalname.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  // Fallback for plain text
  return buffer.toString("utf-8").trim();
}

async function analyzeWithGroq(text) {
  const prompt = `
You are a strict and honest ATS (Applicant Tracking System) evaluator.

IMPORTANT: First check if this document is actually a RESUME or CV.
- If it is a Cover Letter, Motivation Letter, or any non-resume document → respond with error JSON only
- If it IS a Resume/CV → analyze it properly

If NOT a resume, respond with ONLY this JSON (nothing else):
{
  "error": "not_a_resume",
  "message": "This is not a resume or CV. Please upload only a Resume/CV document."
}

If it IS a resume, analyze and give a REALISTIC score. Do NOT inflate scores.
Poor resume = 30-50, Average = 51-70, Good = 71-85, Excellent = 86-100.

Resume Content:
"""
${text.slice(0, 6000)}
"""

Be critical. Deduct points for:
- Missing contact info
- No quantified achievements
- Poor formatting / structure
- Missing skills section
- Short or incomplete content

Respond STRICTLY with valid raw JSON only. No explanations, no markdown, no extra text before or after the JSON object.

{
  "atsScore": <realistic number 0-100>,
  "overallRating": "<Excellent|Good|Average|Poor>",
  "summary": "<2-3 brutally honest sentences>",
  "strengths": ["<strength>", "<strength>", ...],
  "skillsFound": ["<skill>", "<skill>", ...],
  "skillGaps": [
    { "skill": "<missing skill>", "importance": "<High|Medium|Low>", "reason": "<brief reason>" },
    ...
  ],
  "improvements": [
    { "category": "<e.g. Formatting>", "issue": "<problem>", "fix": "<suggested fix>" },
    ...
  ],
  "atsBreakdown": {
    "keywords": <0-100>,
    "formatting": <0-100>,
    "readability": <0-100>,
    "completeness": <0-100>
  },
  "jobRoles": ["<suggested role>", "<suggested role>", ...]
}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // Still active & recommended in 2026
    // Alternative faster option (if you want): "llama-3.3-70b-specdec" or newer variants if available
    messages: [{ role: "user", content: prompt }],
    temperature: 1.0,
    max_tokens: 2000,
  });

  const raw = completion.choices[0].message.content;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid AI response format");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (parsed.error === "not_a_resume") {
    throw new Error(parsed.message);
  }

  return parsed;
}

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded." });
    }

    console.log(`📄 Analyzing file: ${req.file.originalname}`);

    const text = await extractText(req.file);

    console.log(`📝 Extracted text preview: ${text.slice(0, 300)}...`);

    if (!text || text.length < 200) {
      return res.status(400).json({
        success: false,
        error: "Unable to extract meaningful text. Please upload a valid PDF, DOCX, or TXT resume.",
      });
    }

    console.log(`✅ Text extracted successfully: ${text.length} characters`);

    const analysis = await analyzeWithGroq(text);

    console.log(`🎯 ATS Score: ${analysis.atsScore}`);

    res.json({ success: true, filename: req.file.originalname, data: analysis });
  } catch (err) {
    console.error("❌ Error during analysis:", err.message);

    if (err.message.includes("429")) {
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded. Please try again in a minute.",
      });
    }

    res.status(500).json({
      success: false,
      error: "Analysis failed: " + (err.message || "Unknown error"),
    });
  }
});

export default router;