import { useState } from "react";
import axios from "axios";
import useAssignmentStore from "../store/assignmentStore";
import socket from "../socket";

const QUESTION_TYPES = ["MCQ", "Short Answer", "Long Answer", "True/False", "Fill in the Blanks"];

export default function AssignmentForm() {
  const { formData, setFormData, setAssignmentId, setStatus, setResult } = useAssignmentStore();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (formData.questionTypes.length === 0) newErrors.questionTypes = "Select at least one question type";
    if (!formData.totalQuestions || formData.totalQuestions <= 0)
      newErrors.totalQuestions = "Must be greater than 0";
    if (!formData.totalMarks || formData.totalMarks <= 0)
      newErrors.totalMarks = "Must be greater than 0";
    return newErrors;
  };

  const handleQuestionTypeToggle = (type) => {
    const current = formData.questionTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setFormData({ questionTypes: updated });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});
  setLoading(true);
  setStatus("processing");

  try {
    const res = await axios.post("http://localhost:8000/api/assignments", {
      ...formData,
      totalQuestions: Number(formData.totalQuestions),
      totalMarks: Number(formData.totalMarks),
    });

    const { assignmentId } = res.data;
    setAssignmentId(assignmentId);

    // Join room first
    socket.emit("join", assignmentId);

    // Listen for updates
    socket.off("status"); // ← remove old listeners first!
    socket.on("status", (data) => {
      console.log("Socket status received:", data); // ← debug log
      setStatus(data.status);
      if (data.status === "completed" && data.result) {
        setResult(data.result);
      }
    });

    // ✅ Also fetch result directly in case socket was too slow
    const poll = setInterval(async () => {
      const check = await axios.get(`http://localhost:8000/api/assignments/${assignmentId}`);
      if (check.data.status === "completed") {
        setStatus("completed");
        setResult(check.data.result);
        clearInterval(poll);
      } else if (check.data.status === "failed") {
        setStatus("failed");
        clearInterval(poll);
      }
    }, 3000); // check every 3 seconds

  } catch (err) {
    console.error(err);
    setStatus("failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Assignment</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Subject */}
        <div style={styles.field}>
          <label style={styles.label}>Subject</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. Mathematics"
            value={formData.subject}
            onChange={(e) => setFormData({ subject: e.target.value })}
          />
          {errors.subject && <span style={styles.error}>{errors.subject}</span>}
        </div>

        {/* Due Date */}
        <div style={styles.field}>
          <label style={styles.label}>Due Date</label>
          <input
            style={styles.input}
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ dueDate: e.target.value })}
          />
          {errors.dueDate && <span style={styles.error}>{errors.dueDate}</span>}
        </div>

        {/* Question Types */}
        <div style={styles.field}>
          <label style={styles.label}>Question Types</label>
          <div style={styles.checkboxGroup}>
            {QUESTION_TYPES.map((type) => (
              <label key={type} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.questionTypes.includes(type)}
                  onChange={() => handleQuestionTypeToggle(type)}
                />
                {type}
              </label>
            ))}
          </div>
          {errors.questionTypes && <span style={styles.error}>{errors.questionTypes}</span>}
        </div>

        {/* Total Questions */}
        <div style={styles.field}>
          <label style={styles.label}>Number of Questions</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            placeholder="e.g. 10"
            value={formData.totalQuestions}
            onChange={(e) => setFormData({ totalQuestions: e.target.value })}
          />
          {errors.totalQuestions && <span style={styles.error}>{errors.totalQuestions}</span>}
        </div>

        {/* Total Marks */}
        <div style={styles.field}>
          <label style={styles.label}>Total Marks</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            placeholder="e.g. 50"
            value={formData.totalMarks}
            onChange={(e) => setFormData({ totalMarks: e.target.value })}
          />
          {errors.totalMarks && <span style={styles.error}>{errors.totalMarks}</span>}
        </div>

        {/* Additional Instructions */}
        <div style={styles.field}>
          <label style={styles.label}>Additional Instructions (optional)</label>
          <textarea
            style={{ ...styles.input, height: "80px", resize: "vertical" }}
            placeholder="e.g. Focus on algebra and geometry"
            value={formData.additionalInstructions}
            onChange={(e) => setFormData({ additionalInstructions: e.target.value })}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Generate Question Paper"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "0 20px" },
  heading: { fontSize: "24px", fontWeight: "bold", marginBottom: "24px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontWeight: "600", fontSize: "14px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", outline: "none" },
  checkboxGroup: { display: "flex", flexWrap: "wrap", gap: "10px" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", cursor: "pointer" },
  error: { color: "red", fontSize: "12px" },
  button: { padding: "12px", backgroundColor: "#4F46E5", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer", fontWeight: "600" },
};