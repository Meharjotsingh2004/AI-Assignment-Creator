import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";


dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuestionPaper = async (assignment) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
You are an exam paper generator. Generate a structured question paper based on the following details:

Subject: ${assignment.subject}
Total Questions: ${assignment.totalQuestions}
Total Marks: ${assignment.totalMarks}
Question Types: ${assignment.questionTypes.join(", ")}
Additional Instructions: ${assignment.additionalInstructions || "None"}

Rules:
- Split questions into sections (Section A, Section B, etc.) based on question types
- Each section should have an instruction line
- Assign difficulty: easy, medium, or hard to each question
- Marks per question should add up to total marks
- Return ONLY a valid JSON object, no explanation, no markdown

Return this exact JSON structure:
{
  "title": "Question Paper - <Subject>",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "questionNumber": 1,
          "text": "Question text here",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ]
}
`;

  const response = await model.generateContent(prompt);
  const raw = response.response.text();

  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json|```/g, "").trim();

  const parsed = JSON.parse(cleaned);
  return parsed;
};