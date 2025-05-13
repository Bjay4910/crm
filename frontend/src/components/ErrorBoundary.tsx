import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Alert,
  AlertTitle,
  Collapse,
  IconButton 
} from '@mui/material';
import { 
  Home as HomeIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Here you could also send the error to your server or error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  handleRefresh = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  toggleDetails = (): void => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderTop: 5, 
              borderColor: 'error.main',
              borderRadius: '4px 4px 4px 4px'
            }}
          >
            <Alert 
              severity="error" 
              variant="outlined" 
              sx={{ mb: 3 }}
            >
              <AlertTitle>Something went wrong</AlertTitle>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Alert>
            
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                We apologize for the inconvenience. You can try:
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" paragraph>
                  • Refreshing the page
                </Typography>
                <Typography variant="body2" paragraph>
                  • Going back to the home page
                </Typography>
                <Typography variant="body2" paragraph>
                  • Checking your network connection
                </Typography>
                <Typography variant="body2" paragraph>
                  • Clearing your browser cache and cookies
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                onClick={this.handleRefresh}
              >
                Refresh Page
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go to Home
              </Button>
            </Box>
            
            <Box>
              <Button 
                size="small" 
                onClick={this.toggleDetails}
                endIcon={this.state.showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ textTransform: 'none' }}
              >
                {this.state.showDetails ? "Hide" : "Show"} Technical Details
              </Button>
              
              <Collapse in={this.state.showDetails}>
                <Paper sx={{ mt: 2, p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Error Details:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '0.8rem',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}
                  >
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
              </Collapse>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;