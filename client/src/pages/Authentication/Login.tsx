import { useState, type ChangeEvent } from "react";
import {useAuth} from "../../hooks/useAuth";

export default function LoginPage() {
    const { Login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    // save array of password errors
    const [passwordError, setPasswordError] = useState<{id: string; message: string}[]>([]);
    
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(""); // Clear email error when user starts typing
        if(!/\S+@\S+\.\S+/.test(e.target.value)) {
            setEmailError("Please enter a valid email address");
        }
    } 

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError([]); // Clear password error when user starts typing
        if(e.target.value.length < 8) {
            // ...prev is attach the previous errors then add the new error to the array
            setPasswordError(prev => [...prev, {id: "pass_length", message: "Password must be at least 8 characters long"}]);
        } else if (!/[A-Z]/.test(e.target.value)) {
            setPasswordError(prev => [...prev, {id: "pass_uppercase", message: "Password must contain at least one uppercase letter"}]);
        } else if (!/[a-z]/.test(e.target.value)) {
            setPasswordError(prev => [...prev, {id: "pass_lowercase", message: "Password must contain at least one lowercase letter"}]);
        } else if (!/[0-9]/.test(e.target.value)) {
            setPasswordError(prev => [...prev, {id: "pass_number", message: "Password must contain at least one number"}]);
        }
    }

    const handleLogin = async () => {
        
        try {
            await Login(email, password); // Call the Login function from the authentication context
        } catch (error) {
            console.error('Login failed:', error);
        }
    }
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow flex items-center justify-center">
                <h2 className="text-3xl font-bold">Login Page</h2>
                <form action = "" method = "post">
                    <label htmlFor = "email-login">Email</label>
                    <input id = "email-login" 
                    placeholder="abc@gmail.com" 
                    name = "email-login" type = "email" 
                    onChange={handleEmailChange} />
                    <div className="text-red-500 text-sm">{emailError}</div>
                    <label htmlFor = "password-login">Password</label>
                    <input id = "password-login"
                    placeholder="MySecurePassword123@"
                    name = "password-login" type = "password" 
                    onChange={handlePasswordChange} />
                    <div className="text-red-500 text-sm">
                        <ul className="list-disc list-inside">

                        {passwordError.map((error) => (
                            <li key={error.id}>{error.message}</li>
                        ))}
                        </ul>
                    </div>
                    <button type = "button" onClick={handleLogin}>Login</button>
                </form>
            </main>
        </div>
    );
}