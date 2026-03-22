import express from "express";
import Assignment from "../models/Assignment.js";
import { assignmentQueue } from "../queues/assignmentQueue.js";

const router = express.Router();

// POST /api/assignments — create assignment & queue job
router.post("/", async (req, res) => {
  try {
    const {
      subject,
      dueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      additionalInstructions,
    } = req.body;

    // Validation
    if (!subject || !dueDate || !totalQuestions || !totalMarks) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (totalQuestions <= 0 || totalMarks <= 0) {
      return res.status(400).json({ error: "Questions and marks must be positive" });
    }

    // Save to MongoDB with status "pending"
    const assignment = await Assignment.create({
      subject,
      dueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      additionalInstructions,
    });

    // Push job to BullMQ
    await assignmentQueue.add("generate", {
      assignmentId: assignment._id.toString(),
    });

    res.status(201).json({ assignmentId: assignment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/assignments/:id — fetch result
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Not found" });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/assignments — fetch all
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/assignments/:id
router.delete("/:id", async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;