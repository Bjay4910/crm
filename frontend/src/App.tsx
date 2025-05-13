import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/SkipLink';

// Query Client
import { queryClient } from './utils/queryClient';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Theme is now managed by ThemeContext

// Determine the base URL based on where the app is running
// This helps when the app is served from the backend at /app
const getBasename = () => {
  // If running in production via our backend server
  if (window.location.pathname.startsWith('/app')) {
    return '/app';
  }
  return '/';
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Custom ThemeProvider that adds dark mode support */}
        <ThemeProvider>
          <CssBaseline />
          <AuthProvider>
            <Router basename={getBasename()}>
              {/* Skip link for keyboard users */}
              <SkipLink targetId="main-content" />
              
              <Box id="main-content" component="main" tabIndex={-1} sx={{ outline: 'none' }}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      {/* Add other protected routes here */}
                    </Route>
                  </Route>
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Router>
          </AuthProvider>
        </ThemeProvider>
        {/* Only show devtools in development */}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;