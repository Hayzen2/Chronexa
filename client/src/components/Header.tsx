import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { accessToken} = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Chronexa</h1>
            <div>
                {accessToken ? (
                    // If logged in, show dashboard, schedule, profile and logout buttons
                    <>
                    <button 
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => navigate("/")}
                    >
                        Homepage
                    </button>
                    <button 
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => navigate("/tasks")}
                    >
                        Tasks
                    </button>
                    <button 
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => navigate("/schedule")}
                    >
                        Schedule
                    </button>
                    <button 
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>
                    <button 
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            navigate("/"); // Redirect to the home page
                        }}
                    >
                        Logout
                    </button>
                    </>
                ) : (
                    // If not logged in, show register and login buttons
                    <>
                    <button 
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                    <button 
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
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

