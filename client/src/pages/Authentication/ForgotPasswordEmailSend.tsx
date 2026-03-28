export default function ForgotPasswordEmailSend() {
    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Email Sent</h1>
            <p className="text-pink-700 mb-4">
                If an account with that email exists, a password reset link has been sent. Please check your inbox.
            </p>
            <button
                className="bg-pink-300 hover:bg-pink-400 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => window.location.href = "/login"}
            >
                Back to Login
            </button>
        </div>
    );
}