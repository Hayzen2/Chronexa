import { useState, useEffect, type ReactNode, useMemo } from "react";
import { AuthContext } from "./authContext";
import { setAccessToken } from "../api/axios";
import { refreshApi, logoutApi, loginApi } from "../api/authApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
    // useEffect is used to perform side effects in functional components
    // that run at specific times 
    useEffect(() => {
        const refreshToken = async () => {
            try {
                const newAccessToken = await refreshApi(); // Call the refresh API to get a new access token
                setAccessToken(newAccessToken);
                setAccessTokenState(newAccessToken); // Update the access token in the state
            } catch (error) {
                console.error('Error refreshing token:', error);
            }
        };

        refreshToken();
    }, []); // runs only once when the component mounts (when the provider is first rendered)

    const Login = async (username: string, password: string) => {
        try{
            const response = await loginApi(username, password); // Call the login API with the provided username and password
            const newAccessToken = response.data; // Assuming the access token is in the response data
            setAccessToken(newAccessToken); // Update the access token in the API client
            setAccessTokenState(newAccessToken); // Update the access token in the state
        } catch (error) {
            console.error('Error logging in:', error);
            throw error; 
        }
    }

    const Logout = async () => {
        try {
            await logoutApi(); // Call the logout API to invalidate the session on the server
        } catch (error) {
            console.error('Error logging out:', error);
            throw error; 
        } finally {
            setAccessToken(null); // Clear the access token in the API client
            setAccessTokenState(null); // Clear the access token in the state
        }
    }

    const value = useMemo(() => ({
        accessToken: accessTokenState,
        Login,
        Logout
    }), [accessTokenState]); 

    return (
        <AuthContext.Provider value = {
            value
        }>
            {children}
        </AuthContext.Provider>
    )
}