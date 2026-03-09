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


app.use(cors({ 
  origin: true, 
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