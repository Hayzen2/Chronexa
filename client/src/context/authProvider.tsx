import { useState, useEffect, type ReactNode, useMemo } from "react";
import { AuthContext } from "./authContext";
import { setAccessToken } from "../api/axios";
import { refreshApi, logoutApi, loginApi, registerApi } from "../api/authApi";
import { getUserProfile } from "../api/userApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
    const [usernameState, setUsernameState] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrlState ] = useState<string | null>(null);

    // useEffect is used to perform side effects in functional components
    // that run at specific times 
    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await refreshApi(); // Attempt to refresh the access token on component mount
                const newAccessToken = data.accessToken;
                setAccessToken(newAccessToken); // Update the access token in the API client
                setAccessTokenState(newAccessToken); // Update the access token in the state

                const userProfile = await getUserProfile(); // Fetch the user's profile information
                setUsernameState(userProfile.username); // Update the username in the state
                setAvatarUrlState(userProfile.avatarUrl); // Update the avatar URL in the state
            } catch (error) {
                console.info('No valid refresh token, user not logged in yet', error);
                setAccessToken(null); // Clear the access token in the API client on failure
                setAccessTokenState(null); // Clear the access token in the state on failure
            }
        };

        initAuth(); // Call the initialization function when the component mounts
    }, []);

    const Login = async (username: string, password: string) => {
        try{
            const response = await loginApi(username, password); // Call the login API with the provided username and password
            const newAccessToken = response.accessToken; // Extract the access token from response
            setAccessToken(newAccessToken); // Update the access token in the API client
            setAccessTokenState(newAccessToken); // Update the access token in the state
        
            const userProfile = await getUserProfile();
            setUsernameState(userProfile.username);
            setAvatarUrlState(userProfile.avatarUrl);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error; 
        }
    }

    const Register = async (username: string, email: string, password: string) => {
        try {
            const response = await registerApi(username, email, password);// Call the register API with the provided username and password
            const newAccessToken = response.accessToken; // Extract the access token from response
            setAccessToken(newAccessToken); // Update the access token in the API client
            setAccessTokenState(newAccessToken); // Update the access token in the state
        
            const userProfile = await getUserProfile();
            setUsernameState(userProfile.username);
            setAvatarUrlState(userProfile.avatarUrl);
        } catch (error) {
            console.error('Error registering:', error);
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
            setUsernameState(null); // Clear the username in the state
            setAvatarUrlState(null); // Clear the avatar URL in the state
        }
    }

    const value = useMemo(() => ({
        accessToken: accessTokenState,
        username: usernameState,
        avatarUrl: avatarUrl,
        Login,
        Logout,
        Register
    }), [accessTokenState, usernameState, avatarUrl]); 

    return (
        <AuthContext.Provider value = {
            value
        }>
            {children}
        </AuthContext.Provider>
    )
}