import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../mocks/server';
import { rest } from 'msw';

// Create a wrapper with the QueryClient provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock local storage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('useAuth hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    localStorage.setItem('auth', JSON.stringify({
      isAuthenticated: false
    }));
    
    // Reset MSW handlers
    server.resetHandlers();
  });
  
  it('should return isAuthenticated as false when not logged in', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
  
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    });
    
    // Mock the login API endpoint
    server.use(
      rest.post('http://localhost:8000/api/users/login', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            success: true,
            data: {
              accessToken: 'fake-token',
              user: {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'user'
              }
            }
          })
        );
      })
    );
    
    // Call the login function
    await waitFor(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    // Verify auth state is updated
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
  
  it('should handle login errors', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    });
    
    // Mock a failed login
    server.use(
      rest.post('http://localhost:8000/api/users/login', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({
            success: false,
            error: {
              message: 'Invalid credentials',
              type: 'AuthenticationError'
            }
          })
        );
      })
    );
    
    // Try to login and expect it to throw
    await expect(result.current.login('bad@example.com', 'wrong')).rejects.toThrow();
    
    // Verify auth state is still not authenticated
    expect(result.current.isAuthenticated).toBe(false);
  });
});