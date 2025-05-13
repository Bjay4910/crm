import axios from 'axios';
import { handleApiError } from '../utils/errorHandling';

// Get the current hostname to determine the API URL
const getApiBaseUrl = () => {
  // If we're running in development mode with frontend on port 3000
  if (window.location.port === '3000') {
    return 'http://localhost:8000/api';
  }
  // If we're running from the backend (either prod or the unified dev approach)
  return `${window.location.origin}/api`;
};

const API_URL = `${getApiBaseUrl()}/users`;

// Configure axios to include credentials in requests
axios.defaults.withCredentials = true;

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  accessToken: string;
  user: User;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
}

// Refreshing token state
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Helper to add a callback to wait for token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Helper to notify all subscribers with new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Create an axios instance with interceptors
const authAxios = axios.create({
  withCredentials: true // Include cookies in all requests
});

// Response interceptor for automatic token refresh
authAxios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is not 401 or it's already a retry, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Mark as retry so we avoid infinite loops
    originalRequest._retry = true;
    
    // If we're already refreshing, wait for the new token
    if (isRefreshing) {
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(authAxios(originalRequest));
        });
      });
    }
    
    isRefreshing = true;
    
    try {
      // Try to refresh the token
      const res = await authAxios.post(`${API_URL}/refresh`);
      const { accessToken } = res.data.data;
      
      // Update the auth state
      const authState = getAuthState();
      if (authState) {
        saveAuthState({
          ...authState,
          accessToken,
          isAuthenticated: true
        });
      }
      
      // Update the authorization header and retry the request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      // Notify all pending requests
      onTokenRefreshed(accessToken);
      
      isRefreshing = false;
      
      return authAxios(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      
      // Clear auth state and redirect to login
      clearAuthState();
      
      // Redirecting to login page should be handled by the app's router
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    }
  }
);

// Save auth state to local storage
export const saveAuthState = (authState: AuthState): void => {
  localStorage.setItem('auth', JSON.stringify(authState));
};

// Get auth state from local storage
export const getAuthState = (): AuthState | null => {
  const authStr = localStorage.getItem('auth');
  if (authStr) {
    return JSON.parse(authStr);
  }
  return null;
};

// Clear auth state from local storage
export const clearAuthState = (): void => {
  localStorage.removeItem('auth');
};

// Register a new user
export const register = async (
  username: string, 
  email: string, 
  password: string
): Promise<AuthState> => {
  try {
    const response = await authAxios.post<AuthResponse>(`${API_URL}/register`, {
      username,
      email,
      password
    });
    
    const authState: AuthState = {
      accessToken: response.data.data.accessToken,
      user: response.data.data.user,
      isAuthenticated: true
    };
    
    saveAuthState(authState);
    
    return authState;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login a user
export const login = async (
  email: string, 
  password: string
): Promise<AuthState> => {
  try {
    const response = await authAxios.post<AuthResponse>(`${API_URL}/login`, {
      email,
      password
    });
    
    const authState: AuthState = {
      accessToken: response.data.data.accessToken,
      user: response.data.data.user,
      isAuthenticated: true
    };
    
    saveAuthState(authState);
    
    return authState;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Logout the current user
export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint to invalidate refresh token
    await authAxios.post(`${API_URL}/logout`);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Even if the API call fails, clear the local state
    clearAuthState();
  }
};

// Logout from all devices
export const logoutAllDevices = async (): Promise<void> => {
  try {
    await authAxios.post(`${API_URL}/logout-all`, {}, {
      headers: authHeader()
    });
    clearAuthState();
  } catch (error) {
    throw handleApiError(error);
  }
};

// Change password
export const changePassword = async (
  currentPassword: string, 
  newPassword: string
): Promise<void> => {
  try {
    await authAxios.post(
      `${API_URL}/change-password`,
      { currentPassword, newPassword },
      { headers: authHeader() }
    );
    // Logout after password change for security
    clearAuthState();
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get the current user's profile
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await authAxios.get(`${API_URL}/me`, {
      headers: authHeader()
    });
    return response.data.data.user;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generate auth header for API requests
export const authHeader = (): Record<string, string> => {
  const authState = getAuthState();
  
  if (authState && authState.accessToken) {
    return { Authorization: `Bearer ${authState.accessToken}` };
  } else {
    return {};
  }
};

// Check if access token has expired
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert from seconds to milliseconds
    return Date.now() >= expiry;
  } catch (e) {
    return true;
  }
};