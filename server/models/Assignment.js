import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  questionNumber: Number,
  text: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  marks: Number,
});

const SectionSchema = new mongoose.Schema({
  title: String,          // for Section A,b, c ...
  instruction: String,    // for instruction like attempt all question
  questions: [QuestionSchema],
});

const AssignmentSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questionTypes: [{ type: String }],   // e.g. ["MCQ", "Short Answer"]
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    additionalInstructions: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    result: {
      title: String,
      sections: [SectionSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", AssignmentSchema);