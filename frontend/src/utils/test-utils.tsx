import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';

// Create a theme for testing
const theme = createTheme();

// Create a fresh query client for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {}
  }
});

interface AllTheProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

// Wrapper component that includes all providers
const AllTheProviders = ({ 
  children, 
  queryClient = createTestQueryClient() 
}: AllTheProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Custom render method that includes the providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
) => {
  const { queryClient, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: (props) => 
      <AllTheProviders {...props} queryClient={queryClient} />,
    ...renderOptions
  });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };