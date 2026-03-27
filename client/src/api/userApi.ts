import api from './axios';

export const getUserProfile = async () => {
    try {
        const respone = await api.get('/user/view');
        return respone.data; // Assuming the user profile data is in the response data
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;

    }
}

export const updateUserProfile = async (username?: string, avatarFile?: File) => {
    try {
        const formData = new FormData();
        if (username) {
            formData.append('username', username);
        }
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }
        const response = await api.put('/user/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Assuming the updated profile data is in the response data
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}