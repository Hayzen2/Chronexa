import { createContext } from "react";

// Define the shape of the authentication context
interface AuthContextType {
    accessToken : string | null;
    Login: (username: string, password: string) => Promise<void>;
    Logout: () => Promise<void>;
}

// Create an instance of the authentication context with default values
export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    Login: () => Promise.resolve(), // Placeholder for the login function
    Logout: () => Promise.resolve(), // Placeholder for the logout function
});

