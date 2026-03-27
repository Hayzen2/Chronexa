import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            
            <div className="text-center bg-white p-8 rounded-2xl shadow-md">

                {/* Big 404 */}
                <h1 className="text-6xl font-bold text-pink-400 mb-2">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Page not found
                </h2>

                <p className="text-gray-500 mb-6">
                    Oops! The page you're looking for doesn't exist.
                </p>

                {/* Button */}
                <button
                    onClick={() => navigate("/")}
                    className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-5 rounded-lg transition"
                >
                    Go back home
                </button>

            </div>
        </div>
    );
}