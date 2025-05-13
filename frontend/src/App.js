import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Demo pages (using regular JS for now)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';
import UserManagementPage from './pages/UserManagementPage';
import InteractionDetailPage from './pages/InteractionDetailPage';
import CalendarPage from './pages/CalendarPage';
import DashboardLayout from './layouts/DashboardLayout';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // Simplified version without authentication
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/customers/edit/:id" element={<CustomerFormPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/interactions/:customerId" element={<InteractionDetailPage />} />
          </Route>
          
          {/* Home route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;