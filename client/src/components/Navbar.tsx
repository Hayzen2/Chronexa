import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    return (
        accessToken ? (
            <nav className="bg-pink-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    
                    <h1 className="text-xl font-bold" onClick={() => navigate("/")}>
                        Chronexa
                    </h1>
                    <ul className="flex space-x-4">
                        <li>
                            <button onClick={() => navigate("/")}>
                                Home
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/tasks")}>
                                Tasks
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/schedule")}>
                                Schedule
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/profile")}>
                                Profile
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/")}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        ) : null
    );
}