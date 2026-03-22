import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";  // ← add this


export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/assignments`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = assignments.filter((a) =>
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");

  // ---- EMPTY STATE ----
  if (!loading && assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        {/* Illustration */}
        <div className="w-48 h-48 mb-6 relative flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full absolute" />
          <div className="relative z-10 bg-white rounded-xl shadow-md p-4 w-28 h-32 flex flex-col gap-2">
            <div className="h-2 bg-gray-300 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="flex items-center justify-center mt-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-xl">✕</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-blue-400 text-xl">✦</div>
          <div className="absolute top-4 left-6 text-blue-300 text-sm">✦</div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">No assignments yet</h2>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          Create your first assignment to start collecting and grading student
          submissions. You can set up rubrics, define marking criteria, and let AI
          assist with grading.
        </p>
        <button
          onClick={() => navigate("/assignments/create")}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium py-2.5 px-5 rounded-full transition-colors"
        >
          <span>+</span> Create Your First Assignment
        </button>
      </div>
    );
  }

  // ---- FILLED STATE ----
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Assignments</h1>
        <p className="text-sm text-gray-400">Manage and create assignments for your classes.</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
          <span>⊟</span> Filter By
        </button>
        <input
          type="text"
          placeholder="Search Assignment"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-72 outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              formatDate={formatDate}
              onView={() => navigate(`/assignments/${assignment._id}`)}
              onRefresh={fetchAssignments}
            />
          ))}
        </div>
      )}

      {/* Floating Create Button */}
      <button
        onClick={() => navigate("/assignments/create")}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium py-2.5 px-6 rounded-full shadow-lg transition-colors"
      >
        + Create Assignment
      </button>
    </div>
  );
}

function AssignmentCard({ assignment, formatDate, onView, onRefresh }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/assignments/${assignment._id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
    setMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-3 relative hover:shadow-md transition-shadow">
      {/* Title + Menu */}
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900 text-base">{assignment.subject}</h3>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 hover:text-gray-700 px-1 text-lg leading-none"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 bg-white border border-gray-100 rounded-xl shadow-lg z-20 w-40 overflow-hidden">
              <button
                onClick={onView}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                View Assignment
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status badge */}
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
        assignment.status === "completed"
          ? "bg-green-100 text-green-700"
          : assignment.status === "processing"
          ? "bg-yellow-100 text-yellow-700"
          : assignment.status === "failed"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-500"
      }`}>
        {assignment.status}
      </span>

      {/* Dates */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
        <span>Assigned on : {formatDate(assignment.createdAt)}</span>
        <span>Due : {formatDate(assignment.dueDate)}</span>
      </div>
    </div>
  );
}