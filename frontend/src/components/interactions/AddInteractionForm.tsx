import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import { createInteraction, Interaction } from '../../services/interactionService';

interface AddInteractionFormProps {
  customerId: number;
  onInteractionAdded: (interaction: Interaction) => void;
}

const interactionTypes = [
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'email', label: 'Email' },
  { value: 'note', label: 'Note' }
];

const AddInteractionForm: React.FC<AddInteractionFormProps> = ({
  customerId,
  onInteractionAdded
}) => {
  const [formData, setFormData] = useState<Omit<Interaction, 'id' | 'user_id'>>({
    customer_id: customerId,
    type: 'note',
    description: '',
    date: new Date().toISOString().slice(0, 16) // Format as "YYYY-MM-DDThh:mm"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (!formData.type || !formData.description) {
      setError('Type and description are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call API to create interaction
      const newInteraction = await createInteraction(formData);
      
      // Show success message
      setSuccess('Interaction added successfully');
      
      // Reset form
      setFormData({
        customer_id: customerId,
        type: 'note',
        description: '',
        date: new Date().toISOString().slice(0, 16)
      });
      
      // Notify parent component
      onInteractionAdded(newInteraction);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding interaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Add New Interaction
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            name="type"
            label="Interaction Type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            required
          >
            {interactionTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="date"
            label="Date & Time"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Interaction'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddInteractionForm;