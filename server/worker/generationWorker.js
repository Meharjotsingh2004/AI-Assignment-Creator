import { Worker } from "bullmq";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Assignment from "../models/Assignment.js";
import { generateQuestionPaper } from "../ai/gemini.js";
import { getIO } from "../socket/index.js";
import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config({ path: path.join(__dirname, "../.env") });

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {}  
};

// Connect worker to MongoDB
mongoose.connect(process.env.MONGO_URI).then(console.log("in Worker.generationWorker"));

const worker = new Worker(
  "assignment-generation",
  async (job) => {
    const { assignmentId } = job.data;
    const io = getIO();

    try {
      // 1. Mark as processing
      await Assignment.findByIdAndUpdate(assignmentId, { status: "processing" });
      io?.to(assignmentId).emit("status", { status: "processing" });

      // 2. Fetch assignment details
      const assignment = await Assignment.findById(assignmentId);

      // 3. Call Gemini
      const result = await generateQuestionPaper(assignment);

      // 4. Save result
      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        result,
      });

      // 5. Notify frontend
      io?.to(assignmentId).emit("status", { status: "completed", result });
    } catch (err) {
      console.error("Worker error:", err);
      await Assignment.findByIdAndUpdate(assignmentId, { status: "failed" });
      io?.to(assignmentId).emit("status", { status: "failed" });
    }
  },
  { connection }
);

console.log("Worker started, waiting for jobs...");
