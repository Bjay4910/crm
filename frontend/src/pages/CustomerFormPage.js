import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const CustomerFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active'
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (isEditing) {
      // Simulate API call
      setTimeout(() => {
        // Mock data for editing
        if (id === '1') {
          setFormData({
            id: 1,
            name: 'Acme Inc.',
            email: 'contact@acme.com',
            phone: '555-1234',
            company: 'Acme Corporation',
            status: 'active'
          });
        }
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditing]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(isEditing ? 'Customer updated successfully' : 'Customer created successfully');
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={formData.name || ''}
                onChange={handleChange}
                fullWidth
                required
                disabled={submitting}
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
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Phone"
                value={formData.phone || ''}
                onChange={handleChange}
                fullWidth
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="company"
                label="Company"
                value={formData.company || ''}
                onChange={handleChange}
                fullWidth
                disabled={submitting}
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
                disabled={submitting}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="lead">Lead</MenuItem>
                <MenuItem value="opportunity">Opportunity</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : (isEditing ? 'Update Customer' : 'Add Customer')}
                </Button>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/customers')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerFormPage;