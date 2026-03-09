import express from "express";
import multer from "multer";
import cors from "cors";
// ...other imports

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(cors({
  origin: "*",
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

router.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const text = await extractText(req.file);
    if (!text || text.length < 100) throw new Error("Invalid resume");

    const analysis = await analyzeWithGroq(text);
    res.json({ success: true, filename: req.file.originalname, data: analysis });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;