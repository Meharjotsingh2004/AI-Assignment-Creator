import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAssignmentStore from "../store/assignmentStore";
import socket from "../socket";

const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Answer Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "True/False",
  "Fill in the Blanks",
];

const defaultQuestionType = () => ({
  type: "Multiple Choice Questions",
  numQuestions: 4,
  marks: 1,
});

export default function CreateAssignment() {
  const navigate = useNavigate();
  const { setAssignmentId, setStatus, setResult } = useAssignmentStore();

  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [questionTypes, setQuestionTypes] = useState([defaultQuestionType()]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const totalQuestions = questionTypes.reduce((s, q) => s + Number(q.numQuestions), 0);
  const totalMarks = questionTypes.reduce((s, q) => s + Number(q.numQuestions) * Number(q.marks), 0);

  // ---- Question type handlers ----
  const addQuestionType = () =>
    setQuestionTypes([...questionTypes, defaultQuestionType()]);

  const removeQuestionType = (index) =>
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));

  const updateQuestionType = (index, field, value) => {
    const updated = [...questionTypes];
    updated[index][field] = value;
    setQuestionTypes(updated);
  };

  const increment = (index, field) => {
    const updated = [...questionTypes];
    updated[index][field] = Number(updated[index][field]) + 1;
    setQuestionTypes(updated);
  };

  const decrement = (index, field) => {
    const updated = [...questionTypes];
    if (Number(updated[index][field]) > 1) {
      updated[index][field] = Number(updated[index][field]) - 1;
      setQuestionTypes(updated);
    }
  };

  // ---- Validation ----
  const validate = () => {
    const newErrors = {};
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    questionTypes.forEach((q, i) => {
      if (!q.numQuestions || q.numQuestions < 1)
        newErrors[`numQuestions_${i}`] = "Min 1";
      if (!q.marks || q.marks < 1)
        newErrors[`marks_${i}`] = "Min 1";
    });
    return newErrors;
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        subject,
        dueDate,
        questionTypes: questionTypes.map((q) => q.type),
        questionConfig: questionTypes,
        totalQuestions,
        totalMarks,
        additionalInstructions: additionalInfo,
      };

      const res = await axios.post("http://localhost:8000/api/assignments", payload);
      const { assignmentId } = res.data;

      setAssignmentId(assignmentId);
      setStatus("processing");

      // Join socket room
      socket.emit("join", assignmentId);
      socket.off("status");
      socket.on("status", (data) => {
        setStatus(data.status);
        if (data.status === "completed" && data.result) {
          setResult(data.result);
          navigate(`/assignments/${assignmentId}`);
        }
        if (data.status === "failed") {
          setLoading(false);
        }
      });

      // Polling fallback
      const poll = setInterval(async () => {
        try {
          const check = await axios.get(
            `http://localhost:8000/api/assignments/${assignmentId}`
          );
          if (check.data.status === "completed") {
            setStatus("completed");
            setResult(check.data.result);
            clearInterval(poll);
            navigate(`/assignments/${assignmentId}`);
          } else if (check.data.status === "failed") {
            setStatus("failed");
            setLoading(false);
            clearInterval(poll);
          }
        } catch (e) {
          clearInterval(poll);
        }
      }, 3000);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <h1 className="text-xl font-semibold text-gray-900">Create Assignment</h1>
        </div>
        <p className="text-sm text-gray-400 ml-4">Set up a new assignment for your students</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-6">
        <div className="h-1 bg-gray-900 rounded-full w-1/2" />
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-6">
        <div>
          <h2 className="font-semibold text-gray-900">Assignment Details</h2>
          <p className="text-sm text-gray-400">Basic information about your assignment</p>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            placeholder="e.g. Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
          />
          {errors.subject && <span className="text-red-500 text-xs">{errors.subject}</span>}
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 text-gray-400 flex items-center justify-center text-2xl">
            ↑
          </div>
          <p className="text-sm text-gray-500 font-medium">Choose a file or drag & drop it here</p>
          <p className="text-xs text-gray-400">JPEG, PNG, upto 10MB</p>
          <button className="border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            Browse Files
          </button>
        </div>
        <p className="text-xs text-gray-400 -mt-4 text-center">
          Upload images of your preferred document/image
        </p>

        {/* Due Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          {errors.dueDate && <span className="text-red-500 text-xs">{errors.dueDate}</span>}
        </div>

        {/* Question Types */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_120px_100px] gap-2 text-xs font-medium text-gray-500 px-1">
            <span>Question Type</span>
            <span className="text-center">No. of Questions</span>
            <span className="text-center">Marks</span>
          </div>

          {questionTypes.map((q, index) => (
            <div key={index} className="grid grid-cols-[1fr_120px_100px] gap-2 items-center">
              {/* Type selector */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <select
                  value={q.type}
                  onChange={(e) => updateQuestionType(index, "type", e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                >
                  {QUESTION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                {questionTypes.length > 1 && (
                  <button
                    onClick={() => removeQuestionType(index)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Num Questions stepper */}
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                <button
                  onClick={() => decrement(index, "numQuestions")}
                  className="text-gray-500 hover:text-gray-900 font-bold w-4"
                >
                  −
                </button>
                <span className="text-sm font-medium">{q.numQuestions}</span>
                <button
                  onClick={() => increment(index, "numQuestions")}
                  className="text-gray-500 hover:text-gray-900 font-bold w-4"
                >
                  +
                </button>
              </div>

              {/* Marks stepper */}
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                <button
                  onClick={() => decrement(index, "marks")}
                  className="text-gray-500 hover:text-gray-900 font-bold w-4"
                >
                  −
                </button>
                <span className="text-sm font-medium">{q.marks}</span>
                <button
                  onClick={() => increment(index, "marks")}
                  className="text-gray-500 hover:text-gray-900 font-bold w-4"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Add Question Type */}
          <button
            onClick={addQuestionType}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-1 w-fit"
          >
            <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg leading-none">
              +
            </span>
            Add Question Type
          </button>

          {/* Totals */}
          <div className="flex flex-col items-end gap-1 text-sm text-gray-600 mt-2">
            <span>Total Questions : <strong>{totalQuestions}</strong></span>
            <span>Total Marks : <strong>{totalMarks}</strong></span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Additional Information <span className="text-gray-400">(For better output)</span>
          </label>
          <div className="relative">
            <textarea
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 resize-none pr-10"
            />
            <span className="absolute bottom-3 right-3 text-gray-400 text-lg">🎤</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => navigate("/assignments")}
          className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-sm font-medium py-2.5 px-5 rounded-full hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-medium py-2.5 px-6 rounded-full transition-colors"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>Next →</>
          )}
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl max-w-sm mx-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            <h3 className="font-semibold text-gray-900 text-lg">Generating Question Paper</h3>
            <p className="text-sm text-gray-400 text-center">
              AI is creating your customized question paper. This may take a few seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}