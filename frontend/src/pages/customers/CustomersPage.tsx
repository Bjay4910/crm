import React from 'react';
import { Box } from '@mui/material';
import CustomerList from '../../components/customers/CustomerList';

const CustomersPage: React.FC = () => {
  return (
    <Box>
      <CustomerList />
    </Box>
  );
};

export default CustomersPage;