import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import { userEvent } from '@testing-library/user-event';

// Component that throws an error
const ErrorThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Component rendered successfully</div>;
};

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
    href: ''
  },
  writable: true
});

describe('ErrorBoundary', () => {
  it('renders its children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });
  
  it('renders error message when a child component throws', () => {
    // Suppress console errors for this test
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    
    // Expect error message to be displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  it('refreshes the page when refresh button is clicked', async () => {
    // Suppress console errors for this test
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    
    // Click the refresh button
    const user = userEvent.setup();
    await user.click(screen.getByText('Refresh Page'));
    
    // Verify that window.location.reload was called
    expect(mockReload).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  it('navigates to home when "Go to Home" button is clicked', async () => {
    // Suppress console errors for this test
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    
    // Click the go home button
    const user = userEvent.setup();
    await user.click(screen.getByText('Go to Home'));
    
    // Verify that window.location.href was set
    expect(window.location.href).toBe('/');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  it('shows error details when "Show Technical Details" is clicked', async () => {
    // Suppress console errors for this test
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    
    // Initially, error details should be hidden
    expect(screen.queryByText('Error Details:')).not.toBeVisible();
    
    // Click the show details button
    const user = userEvent.setup();
    await user.click(screen.getByText('Show Technical Details'));
    
    // Now error details should be visible
    expect(screen.getByText('Error Details:')).toBeVisible();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});