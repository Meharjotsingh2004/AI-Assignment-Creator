import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAssignmentStore from "../store/assignmentStore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const difficultyStyles = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function QuestionPaper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { result, status, setResult, setStatus } = useAssignmentStore();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const paperRef = useRef(null);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/assignments/${id}`);
      const data = res.data;
      setStatus(data.status);
      if (data.result) setResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const handleDownload = () => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const checkNewPage = (height = 10) => {
    if (y + height > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  // Header
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Delhi Public School, Sector-4, Bokaro", pageWidth / 2, y, { align: "center" });
  y += 7;

  pdf.setFontSize(11);
  pdf.text(result.title || "Question Paper", pageWidth / 2, y, { align: "center" });
  y += 7;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const totalMarks = result.sections?.reduce(
    (t, s) => t + s.questions?.reduce((a, q) => a + q.marks, 0), 0
  );
  pdf.text("Time Allowed: 3 hours", margin, y);
  pdf.text(`Maximum Marks: ${totalMarks}`, pageWidth - margin, y, { align: "right" });
  y += 6;

  pdf.setFont("helvetica", "italic");
  pdf.text("All questions are compulsory unless stated otherwise.", pageWidth / 2, y, { align: "center" });
  y += 8;

  // Divider
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Student Info
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  ["Name", "Roll Number", "Class & Section"].forEach((label) => {
    checkNewPage();
    pdf.text(`${label}: `, margin, y);
    pdf.line(margin + 25, y, pageWidth - margin, y);
    y += 8;
  });
  y += 4;

  // Sections
  result.sections?.forEach((section) => {
    checkNewPage(12);

    // Section title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(section.title, margin, y);
    y += 6;

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.text(section.instruction || "", margin, y);
    y += 7;

    // Questions
    section.questions?.forEach((q) => {
      checkNewPage(12);

      const questionText = `${q.questionNumber}. ${q.text}`;
      const lines = pdf.splitTextToSize(questionText, maxWidth - 10);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      lines.forEach((line) => {
        checkNewPage();
        pdf.text(line, margin, y);
        y += 5.5;
      });

      // Difficulty + marks
      checkNewPage();
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100);
      pdf.text(
        `[${q.difficulty?.toUpperCase()}]   [${q.marks} ${q.marks === 1 ? "Mark" : "Marks"}]`,
        margin + 4,
        y
      );
      pdf.setTextColor(0);
      y += 8;
    });

    y += 4;
  });

  // Footer
  checkNewPage();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("— End of Question Paper —", pageWidth / 2, y, { align: "center" });

  pdf.save(`${result.title || "question-paper"}.pdf`);
};

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading question paper...</p>
      </div>
    );
  }

  // ---- Still processing ----
  if (status === "processing" || status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <h3 className="font-semibold text-gray-900">Generating Question Paper...</h3>
        <p className="text-gray-400 text-sm">This may take a few seconds</p>
      </div>
    );
  }

  // ---- Failed ----
  if (status === "failed" || !result) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="text-5xl">❌</div>
        <h3 className="font-semibold text-gray-900">Generation Failed</h3>
        <p className="text-gray-400 text-sm">Something went wrong. Please try again.</p>
        <button
          onClick={() => navigate("/assignments/create")}
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---- Success ----
  return (
    <div className="max-w-3xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/assignments")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Assignments
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            ✓ Generated
          </span>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
          >
            {downloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>⬇ Download as PDF</>
            )}
          </button>
        </div>
      </div>

      {/* AI message banner */}
      <div className="bg-gray-900 text-white rounded-2xl p-4 mb-6">
        <p className="text-sm leading-relaxed">
          Certainly! Here are your customized Question Paper for{" "}
          <strong>{result.title}</strong>
        </p>
      </div>

      {/* Question Paper — this div gets captured for PDF */}
      <div ref={paperRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Paper Header */}
        <div className="text-center mb-6 border-b border-gray-200 pb-6">
          <h1 className="text-xl font-bold text-gray-900">Delhi Public School, Sector-4, Bokaro</h1>
          <p className="text-sm text-gray-600 mt-1">{result.title}</p>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>Time Allowed: 3 hours</span>
            <span>
              Maximum Marks:{" "}
              {result.sections?.reduce(
                (total, section) =>
                  total + section.questions?.reduce((s, q) => s + q.marks, 0),
                0
              )}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2 italic">
            All questions are compulsory unless stated otherwise.
          </p>
        </div>

        {/* Student Info */}
        <div className="flex flex-col gap-3 mb-8">
          {["Name", "Roll Number", "Class & Section"].map((label) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-28">{label}:</span>
              <div className="flex-1 border-b border-gray-400 h-5" />
            </div>
          ))}
        </div>

        <hr className="border-gray-900 border mb-8" />

        {/* Sections */}
        {result.sections?.map((section, sIdx) => (
          <div key={sIdx} className="mb-10">
            <h2 className="text-base font-bold text-gray-900 mb-1">{section.title}</h2>
            <p className="text-xs text-gray-500 italic mb-4">{section.instruction}</p>

            <div className="flex flex-col gap-4">
              {section.questions?.map((q, qIdx) => (
                <div key={qIdx} className="flex gap-3">
                  <span className="text-sm font-semibold text-gray-700 min-w-[28px]">
                    {q.questionNumber}.
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed mb-2">{q.text}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                          difficultyStyles[q.difficulty] || "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-gray-200 pt-4 mt-4 text-center">
          <p className="text-sm font-semibold text-gray-700">— End of Question Paper —</p>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}