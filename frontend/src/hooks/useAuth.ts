import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  login, 
  register, 
  logout, 
  logoutAllDevices, 
  getCurrentUser, 
  changePassword,
  getAuthState,
  clearAuthState,
  AuthState,
  User
} from '../services/authService';
import { QueryKeys } from '../utils/queryClient';
import { useCallback } from 'react';

// Hook for managing authentication state
export const useAuth = () => {
  const queryClient = useQueryClient();
  
  // Get the current auth state from local storage
  const authState = getAuthState();
  const isAuthenticated = !!authState?.isAuthenticated;
  
  // Query for fetching current user profile
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: QueryKeys.currentUser,
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Don't refetch on window focus for auth state
    refetchOnWindowFocus: false
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      login(email, password),
    onSuccess: () => {
      // Refetch current user data after login
      queryClient.invalidateQueries({ queryKey: QueryKeys.currentUser });
    }
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) => 
      register(username, email, password),
    onSuccess: () => {
      // Refetch current user data after registration
      queryClient.invalidateQueries({ queryKey: QueryKeys.currentUser });
    }
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all query cache on logout
      queryClient.clear();
    }
  });
  
  // Logout all devices mutation
  const logoutAllDevicesMutation = useMutation({
    mutationFn: logoutAllDevices,
    onSuccess: () => {
      // Clear all query cache on logout
      queryClient.clear();
    }
  });
  
  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => 
      changePassword(currentPassword, newPassword),
    onSuccess: () => {
      // Clear all query cache after password change (user will be logged out)
      queryClient.clear();
    }
  });
  
  // Helper function to check if the user is authenticated
  const checkAuth = useCallback(() => {
    return isAuthenticated;
  }, [isAuthenticated]);
  
  return {
    user,
    isAuthenticated,
    isLoading: isLoadingUser,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    logoutAllDevices: logoutAllDevicesMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    checkAuth
  };
};