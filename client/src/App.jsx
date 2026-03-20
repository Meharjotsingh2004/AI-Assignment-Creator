import AssignmentForm from "./components/AssignmentForm";
import QuestionPaper from "./components/QuestionPaper";
import useAssignmentStore from "./store/assignmentStore";

export default function App() {
  const { status } = useAssignmentStore();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "20px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
          VedaAI — Assessment Creator
        </h1>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "32px" }}>
          Generate AI-powered question papers instantly
        </p>

        {/* Always show form unless completed */}
        {status !== "completed" && <AssignmentForm />}

        {/* Show paper or status */}
        <QuestionPaper />
      </div>
    </div>
  );
}