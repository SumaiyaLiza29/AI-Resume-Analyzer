import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import analyzeRouter from "./routes/analyze.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const app = express();

// CORS সমাধান: সব লোকালহোস্ট পোর্ট অ্যালাউ করা হয়েছে
app.use(cors({ 
  origin: true, // এটি রিকোয়েস্টের অরিজিন অটোমেটিক ডিটেক্ট করে অ্যালাউ করবে
  credentials: true 
}));

app.use(express.json());
app.use("/api", analyzeRouter);

app.get("/", (req, res) => {
  res.send("✅ Resume Analyzer API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});