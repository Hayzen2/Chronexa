import { useNavigate } from "react-router-dom";

export default function ForgotPasswordSuccessful() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            
            <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-sm">

                {/* Icon */}
                <div className="text-4xl mb-2"><i className="fas fa-check-circle text-green-500"></i></div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-pink-600 mb-2">
                    Password Reset Successful
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Your password has been updated successfully.  
                    You can now log in with your new password.
                </p>

                {/* Actions */}
                <div className="flex flex-col space-y-3">

                    <button
                        onClick={() => navigate("/login")}
                        className="bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 transition"
                    >
                        Go to Login
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-500 hover:text-pink-500"
                    >
                        Back to Home
                    </button>

                </div>

            </div>
        </div>
    );
}