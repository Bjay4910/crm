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
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: { xs: 1, sm: 2 }, // Responsive padding
      width: '100%' 
    }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          '& .MuiTextField-root': {
            mt: { xs: 1, sm: 0 } // Add spacing on mobile
          }
        }}
      >
        <Grid container spacing={{ xs: 1, sm: 2 }}> {/* Responsive spacing */}
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="name"
              inputProps={{
                'aria-label': 'Customer name',
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
              autoComplete="email"
              inputProps={{
                'aria-label': 'Customer email',
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone || ''}
              onChange={handleChange}
              fullWidth
              autoComplete="tel"
              inputProps={{
                'aria-label': 'Customer phone number',
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="company"
              label="Company"
              value={formData.company || ''}
              onChange={handleChange}
              fullWidth
              autoComplete="organization"
              inputProps={{
                'aria-label': 'Customer company',
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="status"
              label="Status"
              select
              value={formData.status || 'active'}
              onChange={handleChange}
              fullWidth
              inputProps={{
                'aria-label': 'Customer status',
              }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="lead">Lead</MenuItem>
              <MenuItem value="opportunity">Opportunity</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on mobile
            gap: { xs: 1, sm: 2 }, 
            mt: { xs: 2, sm: 3 } 
          }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              fullWidth={true}
              aria-label={loading ? 'Saving customer data' : 'Save customer data'}
              sx={{ flex: { sm: 1 } }}
            >
              {loading ? 'Saving...' : 'Save Customer'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/customers')}
              fullWidth={true}
              aria-label="Cancel and return to customers list"
              sx={{ flex: { sm: 1 } }}
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