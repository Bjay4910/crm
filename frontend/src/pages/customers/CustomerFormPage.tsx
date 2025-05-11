import React from 'react';
import { Box } from '@mui/material';
import CustomerForm from '../../components/customers/CustomerForm';
import { useParams } from 'react-router-dom';

const CustomerFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  return (
    <Box>
      <CustomerForm isEditing={isEditing} />
    </Box>
  );
};

export default CustomerFormPage;