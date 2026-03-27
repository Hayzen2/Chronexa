export default function PasswordResetExpired() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Password Reset Link Expired</h1>
            <p>Sorry, the password reset link you used has expired. Please request a new password reset link.</p>
        </div>
    );
}