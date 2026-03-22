import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <div className="bg-gray-900 rounded-3xl p-10 flex flex-col gap-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-orange-400 opacity-10 rounded-full translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-white font-bold text-lg">VedaAI</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight max-w-lg">
            AI-Powered Assessment Creator for Modern Teachers
          </h1>
          <p className="text-gray-400 text-base mt-4 max-w-md leading-relaxed">
            Generate customized question papers in seconds. Just define your
            requirements and let AI do the heavy lifting.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => navigate("/assignments/create")}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold py-3 px-6 rounded-full transition-colors"
            >
              <span>✦</span> Create Assignment
            </button>
            <button
              onClick={() => navigate("/assignments")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-3 px-6 rounded-full transition-colors"
            >
              View Assignments →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Question Types", value: "7+", desc: "MCQ, Short, Long & more" },
          { label: "AI Generated", value: "100%", desc: "Structured & formatted" },
          { label: "Export Ready", value: "PDF", desc: "Download instantly" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 flex flex-col gap-1">
            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
            <span className="text-xs text-gray-400">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">How it works</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Fill Assignment Details",
              desc: "Enter subject, due date, question types, number of questions and marks.",
              icon: "📝",
            },
            {
              step: "02",
              title: "AI Generates Paper",
              desc: "Our AI structures the prompt and generates a complete question paper with difficulty levels.",
              icon: "🤖",
            },
            {
              step: "03",
              title: "Download as PDF",
              desc: "View the formatted question paper and download it as a clean PDF instantly.",
              icon: "📄",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-500">{item.step}</span>
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Features</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "⚡", title: "Real-time Generation", desc: "WebSocket powered live updates as your paper is being generated." },
            { icon: "🎯", title: "Difficulty Levels", desc: "Each question is tagged as Easy, Medium or Hard automatically." },
            { icon: "📚", title: "Multiple Question Types", desc: "Support for MCQ, Short, Long Answer, Diagrams, Numericals and more." },
            { icon: "🏫", title: "Structured Sections", desc: "Questions are automatically grouped into sections A, B, C etc." },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      

      <div className="h-4" />
    </div>
  );
}