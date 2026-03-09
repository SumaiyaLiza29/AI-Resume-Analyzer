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

  if (mimetype === "application/pdf" || originalname.toLowerCase().endsWith(".pdf")) {
    const PDFParser = (await import("pdf2json")).default;

    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const text = pdfData.Pages
            .map(page =>
              page.Texts
                .map(t => {
                  try {
                    return decodeURIComponent(t.R.map(r => r.T).join(""));
                  } catch {
                    // ✅ decode fail হলে raw text নাও
                    return t.R.map(r => r.T).join("");
                  }
                })
                .join(" ")
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

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    originalname.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  return buffer.toString("utf-8").trim();
}

async function analyzeWithGroq(text) {
  // Spaced text clean করো (S U M A I Y A → SUMAIYA)
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
- Be brutally honest

Resume Content:
"""
${cleanText.slice(0, 6000)}
"""

Deduct score for: missing contact info, no quantified achievements, weak formatting, missing skills section, very short content, no work experience.

Return ONLY raw JSON (no markdown, no explanation):
{
  "atsScore": <unique realistic number based on THIS specific resume>,
  "overallRating": "<Excellent|Good|Average|Poor>",
  "summary": "<2-3 brutally honest sentences specific to this resume>",
  "strengths": ["<real strength from this resume>","<strength>","<strength>"],
  "skillsFound": ["<actual skill in resume>","<skill>","<skill>","<skill>","<skill>"],
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
  "jobRoles": ["<specific role for this resume>","<role>","<role>"]
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

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded." });
    }

    console.log(`📄 Analyzing: ${req.file.originalname}`);

    const text = await extractText(req.file);
    console.log(`📝 Preview: ${text.slice(0, 200)}`);

    if (!text || text.length < 100) {
      return res.status(400).json({
        success: false,
        error: "Could not extract text. Please upload a valid PDF or DOCX resume.",
      });
    }

    console.log(`✅ Extracted: ${text.length} chars`);

    const analysis = await analyzeWithGroq(text);
    console.log(`🎯 ATS Score: ${analysis.atsScore}`);

    res.json({ success: true, filename: req.file.originalname, data: analysis });

  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.message.includes("429")) {
      return res.status(429).json({ success: false, error: "Rate limit. Try again in 1 minute." });
    }
    res.status(500).json({ success: false, error: "Analysis failed: " + err.message });
  }
});

export default router;