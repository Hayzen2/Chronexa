import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "../../api/authApi";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // If no token -> direct to expired page
    useEffect(() => {
        if (!token) {
            navigate("/reset-expired");
        }
    }, [token, navigate]);

    const validatePassword = (value: string) => {
        const errs: string[] = [];

        if (value.length < 8) errs.push("At least 8 characters");
        if (!/[A-Z]/.test(value)) errs.push("1 uppercase letter");
        if (!/[a-z]/.test(value)) errs.push("1 lowercase letter");
        if (!/[0-9]/.test(value)) errs.push("1 number");

        setErrors(errs);
    };

    const handleSubmit = async () => {
        if (!token) return;

        setLoading(true);

        try {
            await resetPasswordApi(token, password);
            navigate("/reset-success");

        } catch (error) {
            console.error("Password reset failed:", error);
            navigate("/reset-expired");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">

                <h2 className="text-2xl font-bold text-center text-pink-700 mb-4">
                    Reset Password
                </h2>

                <div className="flex flex-col space-y-3">

                    {/* Password input */}
                    <input
                        type="password"
                        placeholder="New password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                        }}
                        className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />

                    {/* Validation */}
                    <ul className="text-red-500 text-sm list-disc list-inside">
                        {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={errors.length > 0 || !password || loading}
                        className="bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 transition disabled:opacity-50"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </div>
            </div>
        </div>
    );
}