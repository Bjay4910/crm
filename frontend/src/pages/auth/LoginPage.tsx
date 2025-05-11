import React from 'react';
import { Box, Paper, Container } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3}>
        <Box p={3}>
          <LoginForm />
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;