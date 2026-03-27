import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken, username, Logout, avatarUrl } = useAuth();

    const isActive = (path: string) =>
        location.pathname === path
            ? "text-pink-700 font-semibold"
            : "text-gray-600";

    if (!accessToken) return null;

    return (
        <aside className={`${isOpen ? "w-64" : "w-20"} bg-pink-100 border-r border-pink-200 shadow-sm flex flex-col h-screen transition-all duration-300`}>
            <div className="flex flex-col h-full p-6">
                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-2xl text-pink-700 hover:text-pink-500 transition mb-6 self-end"
                >
                    {isOpen ? "✕" : "☰"}
                </button>
                {/* Logo */}
                {isOpen && (
                    <h1
                        className="text-2xl font-bold text-pink-700 cursor-pointer hover:text-pink-500 transition mb-8"
                        onClick={() => navigate("/")}
                    >
                        🌸 Chronexa
                    </h1>
                )}

                {/* Menu */}
                <ul className="flex flex-col space-y-4 flex-grow">
                    <li>
                        <button
                            onClick={() => navigate("/")}
                            title="Home"
                            className={`w-full text-left px-4 py-2 rounded transition ${
                                isActive("/")
                                    ? "bg-pink-300 text-pink-700 font-semibold"
                                    : "text-gray-600 hover:bg-pink-200"
                            } ${!isOpen && "flex justify-center"}`}
                        >
                            <span className={isOpen ? "" : "text-xl"}>🏠</span>
                            {isOpen && " Home"}
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => navigate("/tasks")}
                            title="Tasks"
                            className={`w-full text-left px-4 py-2 rounded transition ${
                                isActive("/tasks")
                                    ? "bg-pink-300 text-pink-700 font-semibold"
                                    : "text-gray-600 hover:bg-pink-200"
                            } ${!isOpen && "flex justify-center"}`}
                        >
                            <span className={isOpen ? "" : "text-xl"}>✓</span>
                            {isOpen && " Tasks"}
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => navigate("/schedule")}
                            title="Schedule"
                            className={`w-full text-left px-4 py-2 rounded transition ${
                                isActive("/schedule")
                                    ? "bg-pink-300 text-pink-700 font-semibold"
                                    : "text-gray-600 hover:bg-pink-200"
                            } ${!isOpen && "flex justify-center"}`}
                        >
                            <span className={isOpen ? "" : "text-xl"}>📅</span>
                            {isOpen && " Schedule"}
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => navigate("/profile")}
                            title="Profile"
                            className={`w-full text-left px-4 py-2 rounded transition ${
                                isActive("/profile")
                                    ? "bg-pink-300 text-pink-700 font-semibold"
                                    : "text-gray-600 hover:bg-pink-200"
                            } ${!isOpen && "flex justify-center"}`}
                        >
                            <span className={isOpen ? "" : "text-xl"}>👤</span>
                            {isOpen && " Profile"}
                        </button>
                    </li>
                </ul>

                {/* User Section */}
                <div className="border-t border-pink-200 pt-4 mt-4">
                    {isOpen ? (
                        <>
                            <div className="flex items-center space-x-3 mb-4">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-300 flex items-center justify-center flex-shrink-0">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-bold">
                                            {username?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>

                                {/* Username */}
                                <span className="text-pink-700 font-medium text-sm truncate">
                                    {username || "User"}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={async () => {
                                    await Logout();
                                    navigate("/login");
                                }}
                                className="w-full text-left px-4 py-2 rounded text-sm text-gray-600 hover:bg-pink-200 transition"
                            >
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={async () => {
                                await Logout();
                                navigate("/login");
                            }}
                            title="Logout"
                            className="w-full flex justify-center py-2 text-gray-600 hover:bg-pink-200 rounded transition"
                        >
                            🚪
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}