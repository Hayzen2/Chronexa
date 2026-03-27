import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
    const { Register } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (!/\S+@\S+\.\S+/.test(value)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        const errors: string[] = [];

        if (value.length < 8) errors.push("At least 8 characters");
        if (!/[A-Z]/.test(value)) errors.push("1 uppercase letter");
        if (!/[a-z]/.test(value)) errors.push("1 lowercase letter");
        if (!/[0-9]/.test(value)) errors.push("1 number");

        setPasswordErrors(errors);
    };

    const handleRegister = async () => {
        try {
            await Register(username, password, email);
            navigate("/"); // auto login → go home
        } catch (err) {
            console.error("Register failed:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">

                <h2 className="text-2xl font-bold text-center text-pink-700 mb-4">
                    Create Account
                </h2>

                <div className="flex flex-col space-y-3">

                    {/* Username */}
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />

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

                    {/* Password rules */}
                    <ul className="text-red-500 text-sm list-disc list-inside">
                        {passwordErrors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>

                    {/* Register Button */}
                    <button
                        onClick={handleRegister}
                        className="bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 transition"
                    >
                        Register
                    </button>

                    {/* Switch to login */}
                    <p className="text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-pink-500 cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
}