import express from "express";
import multer from "multer";
import cors from "cors";
import mammoth from "mammoth";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ CORS setup
router.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ---------------------------
// Extract text from PDF/DOCX
// ---------------------------
async function extractText(file) {
  const { mimetype, buffer, originalname } = file;

  // PDF
  if (mimetype === "application/pdf" || originalname.toLowerCase().endsWith(".pdf")) {
    const PDFParser = (await import("pdf2json")).default;
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const text = pdfData.Pages
            .map(page =>
              page.Texts.map(t => decodeURIComponent(t.R.map(r => r.T).join(""))).join(" ")
            )
            .join("\n");
          resolve(text.trim());
        } catch (err) {
          reject(err);
        }
      });
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.parseBuffer(buffer);
    });
  }

  // DOCX
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    originalname.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  // Fallback: plain text
  return buffer.toString("utf-8").trim();
}

// ---------------------------
// Analyze text with Groq AI
// ---------------------------
async function analyzeWithGroq(text) {
  const cleanText = text
    .replace(/([A-Za-z])\s(?=[A-Za-z]\s)/g, "$1")
    .replace(/\s{3,}/g, " ")
    .trim();

  const prompt = `
You are a strict ATS evaluator and HR expert. Analyze this resume CRITICALLY.

RULES:
- If this is NOT a resume (cover letter, certificate etc) → return: {"error":"not_a_resume","message":"This is not a resume. Please upload a Resume/CV."}
- Score MUST vary based on actual quality: Poor=30-50, Average=51-70, Good=71-85, Excellent=86-100
- NEVER return the same score for different resumes

Resume Content:
"""
${cleanText.slice(0, 6000)}
"""

Deduct score for: missing contact info, no quantified achievements, weak formatting, missing skills section, very short content, no work experience.

Return ONLY raw JSON (no markdown, no explanation):
{
  "atsScore": <unique realistic number>,
  "overallRating": "<Excellent|Good|Average|Poor>",
  "summary": "<2-3 brutally honest sentences>",
  "strengths": ["<strength1>","<strength2>","<strength3>"],
  "skillsFound": ["<skill1>","<skill2>","<skill3>","<skill4>","<skill5>"],
  "skillGaps": [
    {"skill":"<missing skill>","importance":"<High|Medium|Low>","reason":"<why>"},
    {"skill":"<missing skill>","importance":"<High|Medium|Low>","reason":"<why>"},
    {"skill":"<missing skill>","importance":"<High|Medium|Low>","reason":"<why>"}
  ],
  "improvements": [
    {"category":"<category>","issue":"<specific problem>","fix":"<exact fix>"},
    {"category":"<category>","issue":"<specific problem>","fix":"<exact fix>"},
    {"category":"<category>","issue":"<specific problem>","fix":"<exact fix>"},
    {"category":"<category>","issue":"<specific problem>","fix":"<exact fix>"}
  ],
  "atsBreakdown": {
    "keywords":<0-100>,
    "formatting":<0-100>,
    "readability":<0-100>,
    "completeness":<0-100>
  },
  "jobRoles": ["<role1>","<role2>","<role3>"]
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 1.2,
    max_tokens: 2000,
  });

  const raw = completion.choices[0].message.content;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response");

  const parsed = JSON.parse(jsonMatch[0]);
  if (parsed.error === "not_a_resume") throw new Error(parsed.message);

  return parsed;
}

// ---------------------------
// Route: POST /analyze
// ---------------------------
router.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    console.log("📂 Received file:", req.file.originalname);

    const text = await extractText(req.file);
    console.log("📝 Extracted text length:", text.length);

    if (!text || text.length < 100) throw new Error("Invalid resume");

    const analysis = await analyzeWithGroq(text);
    console.log("✅ Analysis complete for:", req.file.originalname);

    res.json({ success: true, filename: req.file.originalname, data: analysis });

  } catch (err) {
    console.error("❌ Error analyzing resume:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;