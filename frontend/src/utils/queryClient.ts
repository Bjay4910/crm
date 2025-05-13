import { QueryClient } from '@tanstack/react-query';
import { isTokenExpired, getAuthState } from '../services/authService';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 401 (Unauthorized) or 403 (Forbidden)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // For other errors, retry up to 2 times
        return failureCount < 2;
      },
      // Check if auth token is expired before making queries
      // This reduces unnecessary API calls
      enabled: () => {
        const authState = getAuthState();
        if (!authState || !authState.isAuthenticated || !authState.accessToken) {
          return false;
        }
        
        return !isTokenExpired(authState.accessToken);
      }
    },
    mutations: {
      // Don't retry mutations
      retry: false,
      // Handle any mutation errors globally
      onError: (error: any) => {
        console.error('Mutation error:', error);
        // You could dispatch to a global error handling system here
      }
    }
  }
});

// Custom hook for query keys
export const QueryKeys = {
  // Auth
  currentUser: ['currentUser'],
  
  // Customers
  customers: ['customers'],
  customer: (id: number) => ['customers', id],
  customerSearch: (params: Record<string, any>) => ['customers', 'search', params],
  
  // Interactions
  interactions: ['interactions'],
  customerInteractions: (customerId: number) => ['interactions', 'customer', customerId],
  interaction: (id: number) => ['interactions', id],
  
  // Dashboard
  dashboardStats: ['dashboard', 'stats']
};