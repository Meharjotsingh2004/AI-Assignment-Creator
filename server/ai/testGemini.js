import { generateQuestionPaper } from "../ai/gemini.js";

const test = async () => {
  const fakeAssignment = {
    subject: "Mathematics",
    totalQuestions: 5,
    totalMarks: 20,
    questionTypes: ["MCQ", "Short Answer"],
    additionalInstructions: "Include at least one tricky question and give options",
  };

  try {
    const result = await generateQuestionPaper(fakeAssignment);
    console.log("✅ Generated Paper:\n", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};
test();