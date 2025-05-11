import React from 'react';
import { Box, Paper, Container } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3}>
        <Box p={3}>
          <RegisterForm />
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;