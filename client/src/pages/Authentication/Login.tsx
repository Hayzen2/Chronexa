import { useState, type ChangeEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { Login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState<{id: string; message: string}[]>([]);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError("");
        if (!/\S+@\S+\.\S+/.test(e.target.value)) {
            setEmailError("Please enter a valid email address");
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError([]);

        if (e.target.value.length < 8) {
            setPasswordError(prev => [...prev, {id: "pass_length", message: "At least 8 characters"}]);
        } else if (!/[A-Z]/.test(e.target.value)) {
            setPasswordError(prev => [...prev, {id: "pass_uppercase", message: "1 uppercase letter"}]);
        } else if (!/[a-z]/.test(e.target.value)) {
            setPasswordError(prev => [...prev, {id: "pass_lowercase", message: "1 lowercase letter"}]);
        } else if (!/[0-9]/.test(e.target.value)) {
            setPasswordError(prev => [...prev, {id: "pass_number", message: "1 number"}]);
        }
    };

    const handleLogin = async () => {
        try {
            await Login(email, password);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">

                <h2 className="text-2xl font-bold text-center text-pink-700 mb-4">
                    Login
                </h2>

                <div className="flex flex-col space-y-3">

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="abc@gmail.com"
                        onChange={handleEmailChange}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    {emailError && (
                        <div className="text-red-500 text-sm">{emailError}</div>
                    )}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={handlePasswordChange}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />

                    <ul className="text-red-500 text-sm list-disc list-inside">
                        {passwordError.map((error) => (
                            <li key={error.id}>{error.message}</li>
                        ))}
                    </ul>

                    {/* Forgot Password */}
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-pink-500 hover:underline text-right"
                    >
                        Forgot password?
                    </button>

                    {/* Login Button */}
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 transition"
                    >
                        Login
                    </button>

                </div>
            </div>
        </div>
    );
}