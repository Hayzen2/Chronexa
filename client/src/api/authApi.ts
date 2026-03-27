import api from './axios';

export const refreshApi = async () => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data; // new access token here
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error; 
  }
}

export const loginApi = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data; // Assuming the access token is in the response data
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; 
  }
}

export const registerApi = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data; // Assuming the access token is in the response data
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}

export const logoutApi = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error; 
  }
}

export const forgotPasswordApi = async (email: string) => {
  try {
    await api.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Error processing forgot password:', error);
    throw error; 
  }
}

export const resetPasswordApi = async (token: string, newPassword: string) => {
  try {
    await api.post('/auth/reset-password', { token, newPassword });
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error; 
  }
}