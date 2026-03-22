import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileText,
    Wand2,
    Library,
    Settings,
} from "lucide-react";

const navItems = [
    { label: "Home", icon: LayoutDashboard, path: "/" },
    { label: "Assignments", icon: FileText, path: "/assignments" },
    { label: "My Groups", icon: Users, path: "/groups" },
    { label: "AI Teacher's Toolkit", icon: Wand2, path: "/toolkit" },
    { label: "My Library", icon: Library, path: "/library" },
];

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="w-60 min-h-screen bg-white flex flex-col justify-between py-6 px-4 border-r border-gray-100 fixed left-0 top-0">

            {/* Top */}
            <div className="flex flex-col gap-6">
                {/* Logo */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-2 mb-2 cursor-pointer"
                >
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">GEN AI</span>
                </div>

                {/* Create Assignment Button */}
                <button
                    onClick={() => navigate("/assignments/create")}
                    className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium py-2.5 px-4 rounded-full transition-colors"
                >
                    <span className="text-orange-400 text-lg">✦</span>
                    Create Assignment
                </button>

                {/* Nav Items */}
                <nav className="flex flex-col gap-1">
                    {navItems.map(({ label, icon: Icon, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom */}
            <div className="flex flex-col gap-4">
                <button className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <Settings size={16} />
                    Settings
                </button>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                        <span className="text-lg">🎓</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">Delhi Public School</span>
                        <span className="text-xs text-gray-400">Bokaro Steel City</span>
                    </div>
                </div>
            </div>
        </div>
    );
}