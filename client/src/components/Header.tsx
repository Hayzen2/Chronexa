import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
    const { accessToken, Logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-pink-100 text-pink-700 p-4 flex justify-between items-center shadow-sm">
            <h1 
                className="text-2xl font-bold cursor-pointer"
                onClick={() => navigate("/")}
            >
                🌸 Chronexa
            </h1>

            <div className="flex gap-2">
                {accessToken ? (
                    <>
                        <button
                            className="bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={() => navigate("/")}
                        >
                            Homepage
                        </button>

                        <button
                            className="bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={() => navigate("/tasks")}
                        >
                            Tasks
                        </button>

                        <button
                            className="bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={() => navigate("/profile")}
                        >
                            Profile
                        </button>

                        <button
                            className="bg-red-300 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={() => {
                                Logout();
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>

                        <button
                            className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}