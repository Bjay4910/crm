import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  MenuItem,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
  Customer
} from '../../services/customerService';

interface CustomerFormProps {
  isEditing?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isEditing = false }) => {
  const [formData, setFormData] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (isEditing && id) {
      fetchCustomer(parseInt(id));
    }
  }, [isEditing, id]);

  const fetchCustomer = async (customerId: number) => {
    try {
      setLoading(true);
      const customer = await getCustomerById(customerId);
      setFormData(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Error fetching customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (isEditing && id) {
        // Update existing customer
        await updateCustomer(parseInt(id), formData);
        setSuccess('Customer updated successfully');
      } else {
        // Create new customer
        await createCustomer(formData);
        setSuccess('Customer created successfully');
        
        // Reset form for new customer
        if (!isEditing) {
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            status: 'active'
          });
        }
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="company"
              label="Company"
              value={formData.company || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="status"
              label="Status"
              select
              value={formData.status || 'active'}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="lead">Lead</MenuItem>
              <MenuItem value="opportunity">Opportunity</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Customer'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/customers')}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CustomerForm;