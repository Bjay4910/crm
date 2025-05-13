import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: () => void;
}

/**
 * Hook for handling keyboard shortcuts and navigation
 * 
 * @param shortcuts Custom shortcuts to add (optional)
 * @returns Object with available shortcuts info
 */
export const useKeyboardNavigation = (shortcuts: KeyboardShortcut[] = []) => {
  const navigate = useNavigate();

  // Default application shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      altKey: true,
      description: 'Navigate to Home',
      action: () => navigate('/')
    },
    {
      key: 'd',
      altKey: true,
      description: 'Navigate to Dashboard',
      action: () => navigate('/dashboard')
    },
    {
      key: 'c',
      altKey: true,
      description: 'Navigate to Customers',
      action: () => navigate('/customers')
    },
    {
      key: 'n',
      altKey: true,
      description: 'Add New Customer',
      action: () => navigate('/customers/new')
    },
    {
      key: '/',
      description: 'Focus Search',
      action: () => {
        const searchInput = document.querySelector('[aria-label="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    },
    {
      key: 'Escape',
      description: 'Close Modal or Dialogue',
      action: () => {
        // Attempt to find a visible "close" button and click it
        const closeButton = Array.from(document.querySelectorAll('button'))
          .find(button => 
            (button.textContent === 'Close' || 
             button.textContent === 'Cancel' || 
             button.getAttribute('aria-label')?.includes('close')) && 
            window.getComputedStyle(button).display !== 'none');
        
        if (closeButton) {
          (closeButton as HTMLButtonElement).click();
        }
      }
    }
  ];

  // Combine default shortcuts with custom shortcuts
  const allShortcuts = [...defaultShortcuts, ...shortcuts];

  // Handler for keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input or textarea
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement).isContentEditable
    ) {
      return;
    }

    // Check if the pressed key combination matches any shortcut
    const matchedShortcut = allShortcuts.find(shortcut => {
      const keyMatch = shortcut.key === event.key;
      const ctrlMatch = shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
      const altMatch = shortcut.altKey === undefined || shortcut.altKey === event.altKey;
      const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey;
      
      return keyMatch && ctrlMatch && altMatch && shiftMatch;
    });

    if (matchedShortcut) {
      event.preventDefault();
      matchedShortcut.action();
    }
  }, [allShortcuts, navigate]);

  // Set up event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Create a formatted list of shortcuts for help displays
  const shortcutList = allShortcuts.map(shortcut => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.altKey) keys.push('Alt');
    if (shortcut.shiftKey) keys.push('Shift');
    
    const keyName = shortcut.key === ' ' ? 'Space' : 
                    shortcut.key.length === 1 ? shortcut.key.toUpperCase() : 
                    shortcut.key;
    
    keys.push(keyName);
    
    return {
      keys: keys.join(' + '),
      description: shortcut.description
    };
  });

  return {
    shortcuts: shortcutList
  };
};

// Export a type for components to use when defining custom shortcuts
export type { KeyboardShortcut };