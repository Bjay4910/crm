import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../utils/test-utils';
import { userEvent } from '@testing-library/user-event';
import CustomerList from './CustomerList';
import { QueryClient } from '@tanstack/react-query';

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity
    },
  }
});

// Mock the react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('CustomerList component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  it('should render loading state initially', () => {
    render(<CustomerList />, { queryClient });
    
    // Check if the loading indicator is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render the customer list after loading', async () => {
    // Render the component with test query client
    render(<CustomerList />, { queryClient });
    
    // Wait for the loading state to be replaced with data
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Check if customer data is displayed
    await waitFor(() => {
      expect(screen.getByText('Acme Inc.')).toBeInTheDocument();
      expect(screen.getByText('Beta Corp')).toBeInTheDocument();
    });
  });

  it('should allow searching for customers', async () => {
    render(<CustomerList />, { queryClient });
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText('Search customers...');
    
    // Type in the search box
    await userEvent.type(searchInput, 'Acme');
    
    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText('Acme Inc.')).toBeInTheDocument();
      expect(screen.queryByText('Beta Corp')).not.toBeInTheDocument();
    });
  });

  it('should show an error message when search has no results', async () => {
    render(<CustomerList />, { queryClient });
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText('Search customers...');
    
    // Type in the search box with a term that won't match any customers
    await userEvent.type(searchInput, 'NonexistentCustomer');
    
    // Check for the "No customers found" message
    await waitFor(() => {
      expect(screen.getByText('No customers found')).toBeInTheDocument();
    });
  });
});