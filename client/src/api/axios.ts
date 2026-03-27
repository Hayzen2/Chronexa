import axios from 'axios';
import {refreshApi} from './authApi';

// This will lost on page refresh
// Then use refresh token to get 
// new access token and update it in the state
let accessToken: string | null = null; 

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// axios is used to create an instance of the API client
// it will be used to make HTTP requests to the backend server
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Adjust the base URL as needed
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the access token to every request if it exists
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config; // Proceed with the request
}, (error) => {
  return Promise.reject(error); // Reject the error if the request fails
});


// Handle 401 errors and attempt token refresh
// use (response) => response: handle successful responses by simply returning them
// use async (error) => {...}: handle errors manually
api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config; 

  if(error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // Mark the request as retried
    try {
      // Call refresh API to server to get new access token
      const newAccessToken = await refreshApi();

      // Update the access token in the state
      setAccessToken(newAccessToken);

      // Update the original request with the new access token and retry it
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(originalRequest); // Retry the original request with the new token
    } catch (refreshError) {
      setAccessToken(null); // Clear the access token on refresh failure
      // Redirect to login page 
      globalThis.window.location.href = '/login';
      throw Promise.reject(refreshError); // Reject the error if token refresh fails
    }
  }

  throw Promise.reject(error); // reject the error if it's not a 401 or if the retry has already been attempted
});

export default api;