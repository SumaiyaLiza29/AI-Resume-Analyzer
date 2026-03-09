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

// ---------------------------
// Multer setup with 5MB limit
// ---------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Groq client
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY not set in .env");
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------------------------
// CORS setup
// ---------------------------
router.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------------------------
// Extract text from PDF/DOCX safely
// ---------------------------
async function extractText(file) {
  const { mimetype, buffer, originalname } = file;

  try {
    // PDF
    if (mimetype === "application/pdf" || originalname.toLowerCase().endsWith(".pdf")) {
      const PDFParser = (await import("pdf2json")).default;
      return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          try {
            const text = pdfData.Pages.map((page) =>
              page.Texts.map((t) => decodeURIComponent(t.R.map((r) => r.T).join(""))).join(" ")
            ).join("\n");
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
  } catch (err) {
    console.error("❌ extractText error:", err.message);
    throw new Error("Failed to extract text from file");
  }
}

// ---------------------------
// Analyze text with Groq AI safely
// ---------------------------
async function analyzeWithGroq(text) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY missing");

  const cleanText = text
    .replace(/([A-Za-z])\s(?=[A-Za-z]\s)/g, "$1")
    .replace(/\s{3,}/g, " ")
    .trim();

  const prompt = `
You are a strict ATS evaluator and HR expert. Analyze this resume CRITICALLY.

RULES:
- If this is NOT a resume → return: {"error":"not_a_resume","message":"This is not a resume. Please upload a Resume/CV."}

Resume Content:
"""
${cleanText.slice(0, 6000)}
"""

Return ONLY raw JSON.
`;

  try {
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
  } catch (err) {
    console.error("❌ analyzeWithGroq error:", err.message);
    throw new Error("AI analysis failed: " + err.message);
  }
}

// ---------------------------
// Route: POST /analyze
// ---------------------------
router.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    console.warn("⚠️ No file uploaded");
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  const filename = req.file.originalname || "unknown.pdf";
  console.log("📂 Received file:", filename);

  try {
    const text = await extractText(req.file);
    console.log("📝 Extracted text length:", text.length);

    if (!text || text.length < 100) throw new Error("Invalid resume content");

    const analysis = await analyzeWithGroq(text);
    console.log("✅ Analysis complete for:", filename);

    res.json({ success: true, filename, data: analysis });
  } catch (err) {
    console.error("❌ Error analyzing resume:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;