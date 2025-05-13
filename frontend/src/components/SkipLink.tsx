import React from 'react';
import { Link } from '@mui/material';

interface SkipLinkProps {
  targetId: string;
  label?: string;
}

/**
 * A component that allows keyboard users to skip to the main content
 * This is an important accessibility feature for keyboard-only users
 */
const SkipLink: React.FC<SkipLinkProps> = ({ 
  targetId,
  label = 'Skip to main content'
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Set tabindex to make the element focusable if it isn't already
      if (!targetElement.hasAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');
      }
      
      // Focus the element
      targetElement.focus();
      
      // Also scroll to it for visual users
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Link 
      href={`#${targetId}`}
      onClick={handleClick}
      className="skip-link"
      tabIndex={0}
      aria-label={label}
    >
      {label}
    </Link>
  );
};

export default SkipLink;