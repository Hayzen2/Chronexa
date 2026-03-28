export default function ForgotPassword() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <p>If you've forgotten your password, please enter your email address below to receive instructions on how to reset it.</p>
            <form className="mt-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                    type="submit"
                    className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition duration-200"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}