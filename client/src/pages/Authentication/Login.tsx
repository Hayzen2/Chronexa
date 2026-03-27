import { useState, type ChangeEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { Login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState<{ id: string; message: string }[]>([]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    const errors = [];
    if (val.length < 8) errors.push({ id: "pass_length", message: "At least 8 characters" });
    if (!/[A-Z]/.test(val)) errors.push({ id: "pass_uppercase", message: "1 uppercase letter" });
    if (!/[a-z]/.test(val)) errors.push({ id: "pass_lowercase", message: "1 lowercase letter" });
    if (!/[0-9]/.test(val)) errors.push({ id: "pass_number", message: "1 number" });
    setPasswordError(errors);
  };

  const handleLogin = async () => {
    try {
      await Login(username, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-80 sm:w-96">
          <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
            Login
          </h2>

          <div className="flex flex-col space-y-4">
            {/* Username */}
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {usernameError && (
              <div className="text-red-500 text-sm">{usernameError}</div>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {passwordError.length > 0 && (
              <ul className="text-red-500 text-sm list-disc list-inside">
                {passwordError.map((error) => (
                  <li key={error.id}>{error.message}</li>
                ))}
              </ul>
            )}

            {/* Forgot Password */}
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-pink-500 hover:underline self-end"
            >
              Forgot password?
            </button>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="bg-pink-400 text-white py-3 rounded-lg hover:bg-pink-500 transition font-semibold"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}