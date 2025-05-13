import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import { User } from '../services/authService';

// Define the auth context type
interface AuthContextType {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use our custom hook that leverages React Query
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    logoutAllDevices,
    changePassword
  } = useAuthHook();

  // Create the auth value object for the context
  const authValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: async (email, password) => {
      await login({ email, password });
    },
    register: async (username, email, password) => {
      await register({ username, email, password });
    },
    logout: async () => {
      await logout();
    },
    logoutAllDevices: async () => {
      await logoutAllDevices();
    },
    changePassword: async (currentPassword, newPassword) => {
      await changePassword({ currentPassword, newPassword });
    }
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};