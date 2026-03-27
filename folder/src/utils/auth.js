// auth.js - Utility functions for authentication
import axios from 'axios';

// Get token from storage
export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Get user from storage
export const getUser = () => {
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Set authentication headers
export const setAuthHeaders = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
};

// Initialize auth on app load
export const initAuth = () => {
  setAuthHeaders();
};

// Axios interceptor for handling token refresh
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);