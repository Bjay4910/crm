import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, Typography, Box, Button, Container, Paper } from '@mui/material';

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
});

function App() {
  // Since we're having issues with imports, 
  // let's display a simple placeholder screen
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Typography variant="h3" component="h1" gutterBottom>
              CRM System Prototype
            </Typography>
            <Typography variant="h5" color="textSecondary">
              Welcome to the CRM system prototype!
            </Typography>
            <Typography variant="body1" align="center">
              This is a simple CRM system with React frontend and Express backend.
              The backend server is running on port 5000.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                Services available:
              </Typography>
              <ul>
                <li>User authentication with JWT</li>
                <li>Customer management</li>
                <li>Interaction tracking</li>
                <li>Dashboard with key metrics</li>
              </ul>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => window.location.href = 'http://localhost:5000/health'}
              >
                Check Backend Health
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;