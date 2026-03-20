import useAssignmentStore from "../store/assignmentStore";

const difficultyColors = {
  easy: { background: "#d1fae5", color: "#065f46" },
  medium: { background: "#fef3c7", color: "#92400e" },
  hard: { background: "#fee2e2", color: "#991b1b" },
};

export default function QuestionPaper() {
  const { result, status } = useAssignmentStore();

  if (status === "idle") return null;

  if (status === "processing") {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={{ marginTop: "16px", color: "#6b7280" }}>Generating your question paper...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div style={styles.centered}>
        <p style={{ color: "red" }}>❌ Generation failed. Please try again.</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div style={styles.paper}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{result.title}</h1>
        <div style={styles.studentInfo}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Name:</span>
            <div style={styles.inputLine} />
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Roll Number:</span>
            <div style={styles.inputLine} />
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Section:</span>
            <div style={styles.inputLine} />
          </div>
        </div>
        <hr style={styles.divider} />
      </div>

      {/* Sections */}
      {result.sections.map((section, sIdx) => (
        <div key={sIdx} style={styles.section}>
          <h2 style={styles.sectionTitle}>{section.title}</h2>
          <p style={styles.instruction}>{section.instruction}</p>

          {section.questions.map((q, qIdx) => (
            <div key={qIdx} style={styles.question}>
              <div style={styles.questionHeader}>
                <span style={styles.questionNumber}>Q{q.questionNumber}.</span>
                <span style={styles.questionText}>{q.text}</span>
              </div>
              <div style={styles.questionMeta}>
                <span style={{ ...styles.diffBadge, ...difficultyColors[q.difficulty] }}>
                  {q.difficulty}
                </span>
                <span style={styles.marks}>[{q.marks} marks]</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const styles = {
  paper: { maxWidth: "800px", margin: "40px auto", padding: "40px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  header: { marginBottom: "24px" },
  title: { fontSize: "22px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" },
  studentInfo: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" },
  infoRow: { display: "flex", alignItems: "center", gap: "12px" },
  infoLabel: { fontWeight: "600", fontSize: "14px", minWidth: "100px" },
  inputLine: { flex: 1, borderBottom: "1px solid #000", height: "20px" },
  divider: { border: "none", borderTop: "2px solid #000", margin: "16px 0" },
  section: { marginBottom: "32px" },
  sectionTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "6px" },
  instruction: { fontSize: "13px", color: "#6b7280", fontStyle: "italic", marginBottom: "16px" },
  question: { marginBottom: "16px", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "6px" },
  questionHeader: { display: "flex", gap: "8px", marginBottom: "8px" },
  questionNumber: { fontWeight: "bold", minWidth: "30px" },
  questionText: { fontSize: "14px", lineHeight: "1.6" },
  questionMeta: { display: "flex", alignItems: "center", gap: "10px" },
  diffBadge: { padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" },
  marks: { fontSize: "13px", color: "#374151", fontWeight: "600" },
  centered: { textAlign: "center", padding: "60px 20px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #e5e7eb", borderTop: "4px solid #4F46E5", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" },
};