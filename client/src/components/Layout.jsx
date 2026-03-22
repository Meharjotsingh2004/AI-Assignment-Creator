import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import Sidebar from "./SideBar";

const pageTitles = {
  "/": "Home",
  "/assignments": "Assignment",
  "/assignments/create": "Assignment",
  "/groups": "My Groups",
  "/toolkit": "AI Teacher's Toolkit",
  "/library": "My Library",
};

export default function Layout({ children }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "VedaAI";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main content */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>⊞</span>
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-full hover:bg-gray-100">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center text-sm">
                🎓
              </div>
              John Doe
              <span className="text-gray-400">▾</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}