import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, logout } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isAdmin: false,
  setCurrentUser: () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user.user);
      setIsAuthenticated(true);
      setIsAdmin(user.user.role === 'admin');
    }
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    setCurrentUser: (user: User | null) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      setIsAdmin(user?.role === 'admin' || false);
    },
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};