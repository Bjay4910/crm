import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): AuthResponse | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const authHeader = (): Record<string, string> => {
  const user = getCurrentUser();
  
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};