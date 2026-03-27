import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken, username, Logout, avatarUrl } = useAuth();

    const isActive = (path: string) =>
        location.pathname === path
            ? "text-pink-700 font-semibold"
            : "text-gray-600";

    if (!accessToken) return null;

    return (
        <nav className="bg-pink-100 border-b border-pink-200 shadow-sm px-6 py-3">
            <div className="max-w-6xl mx-auto flex flex-col">

                <div className="flex justify-between items-center mb-2">
                    
                    {/* Logo */}
                    <h1
                        className="text-xl font-bold text-pink-700 cursor-pointer hover:text-pink-500 transition"
                        onClick={() => navigate("/")}
                    >
                        🌸 Chronexa
                    </h1>

                    {/* Menu */}
                    <ul className="flex items-center space-x-6 text-sm">
                        <li>
                            <button
                                onClick={() => navigate("/")}
                                className={`${isActive("/")} hover:text-pink-500 transition`}
                            >
                                Home
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => navigate("/tasks")}
                                className={`${isActive("/tasks")} hover:text-pink-500 transition`}
                            >
                                Tasks
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => navigate("/schedule")}
                                className={`${isActive("/schedule")} hover:text-pink-500 transition`}
                            >
                                Schedule
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => navigate("/profile")}
                                className={`${isActive("/profile")} hover:text-pink-500 transition`}
                            >
                                Profile
                            </button>
                        </li>
                    </ul>
                </div>

                {/* User Section */}
                <div className="flex justify-end items-center border-t border-pink-200 pt-2">
                    
                    <div className="flex items-center space-x-3">

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-pink-300 flex items-center justify-center">
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

                        {/* Username + Logout */}
                        <div className="flex flex-col text-sm">
                            <span className="text-pink-700 font-medium">
                                {username || "User"}
                            </span>

                            <button
                                onClick={async () => {
                                    await Logout();
                                    navigate("/login");
                                }}
                                className="text-xs text-gray-500 hover:text-red-400 text-left"
                            >
                                Logout
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
}