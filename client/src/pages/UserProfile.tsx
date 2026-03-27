import { useState, useEffect, type ChangeEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, updateUserProfile } from "../api/userApi";

export default function UserProfile() {
    const { accessToken } = useAuth();
    const [username, setUsername] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!accessToken) return;
            try {
                const profile = await getUserProfile();
                setUsername(profile.username);
                setAvatarUrl(profile.avatarUrl);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [accessToken]);

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setAvatarUrl(URL.createObjectURL(e.target.files[0])); // Preview new avatar
        }
    };

    const handleSave = async () => {
        try {
            const updated = await updateUserProfile(username, avatarFile || undefined);
            setMessage("Profile updated successfully!");
            setAvatarUrl(updated.avatarUrl); // Update avatar URL after save
        } catch (err) {
            console.error("Failed to update profile:", err);
            setMessage("Failed to update profile.");
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading profile...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-4">
                <img
                    src={avatarUrl || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="text-sm"
                />
            </div>

            {/* Username */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                />
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full bg-pink-400 text-white py-2 rounded hover:bg-pink-500 transition"
            >
                Save Changes
            </button>

            {/* Feedback Message */}
            {message && <p className="text-center mt-3 text-sm text-green-600">{message}</p>}
        </div>
    );
}