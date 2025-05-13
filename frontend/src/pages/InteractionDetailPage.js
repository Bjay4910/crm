import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  MeetingRoom as MeetingIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data for a customer
const MOCK_CUSTOMER = {
  id: 1,
  name: 'Acme Inc.',
  email: 'contact@acme.com',
  phone: '555-1234',
  company: 'Acme Corporation',
  status: 'active',
  created_at: '2023-01-15T12:00:00Z'
};

// Mock data for interactions
const MOCK_INTERACTIONS = [
  {
    id: 1,
    customer_id: 1,
    user_id: 1,
    type: 'call',
    description: 'Initial sales call with marketing team',
    date: '2023-04-10T10:30:00Z',
    user_name: 'John Doe',
    notes: 'Discussed their needs for a CRM system. They are currently using spreadsheets and looking for a more robust solution.',
    duration: 45
  },
  {
    id: 2,
    customer_id: 1,
    user_id: 2,
    type: 'email',
    description: 'Sent proposal following up on meeting',
    date: '2023-04-12T14:00:00Z',
    user_name: 'Jane Smith',
    notes: 'Included pricing options and implementation timeline.',
    attachments: ['proposal.pdf', 'pricing.xlsx']
  },
  {
    id: 3,
    customer_id: 1,
    user_id: 1,
    type: 'meeting',
    description: 'Demo of our CRM solution',
    date: '2023-04-18T11:00:00Z',
    user_name: 'John Doe',
    notes: 'The client was impressed with the reporting capabilities. They want to discuss further about data migration.',
    duration: 60,
    location: 'Virtual - Zoom'
  }
];

const InteractionDetailPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'call',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    notes: '',
    duration: 30,
    location: ''
  });
  
  useEffect(() => {
    // Simulate API calls to get customer and interactions
    setTimeout(() => {
      setCustomer(MOCK_CUSTOMER);
      setInteractions(MOCK_INTERACTIONS);
      setLoading(false);
    }, 1000);
  }, [customerId]);
  
  const handleCreateDialogOpen = () => {
    setFormData({
      type: 'call',
      description: '',
      date: new Date().toISOString().slice(0, 16),
      notes: '',
      duration: 30,
      location: ''
    });
    setCreateDialogOpen(true);
  };
  
  const handleEditDialogOpen = (interaction) => {
    setCurrentInteraction(interaction);
    setFormData({
      type: interaction.type,
      description: interaction.description,
      date: new Date(interaction.date).toISOString().slice(0, 16),
      notes: interaction.notes || '',
      duration: interaction.duration || 30,
      location: interaction.location || ''
    });
    setEditDialogOpen(true);
  };
  
  const handleDeleteDialogOpen = (interaction) => {
    setCurrentInteraction(interaction);
    setDeleteDialogOpen(true);
  };
  
  const handleCreateSubmit = () => {
    // Simulate creating a new interaction
    const newInteraction = {
      id: Math.max(...interactions.map(i => i.id)) + 1,
      customer_id: parseInt(customerId),
      user_id: 1,
      user_name: 'John Doe',
      ...formData,
      date: formData.date
    };
    
    setInteractions([...interactions, newInteraction]);
    setCreateDialogOpen(false);
  };
  
  const handleEditSubmit = () => {
    // Simulate updating an interaction
    const updatedInteractions = interactions.map(interaction => 
      interaction.id === currentInteraction.id 
        ? { ...interaction, ...formData } 
        : interaction
    );
    
    setInteractions(updatedInteractions);
    setEditDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    // Simulate deleting an interaction
    const updatedInteractions = interactions.filter(
      interaction => interaction.id !== currentInteraction.id
    );
    
    setInteractions(updatedInteractions);
    setDeleteDialogOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call':
        return <PhoneIcon />;
      case 'email':
        return <EmailIcon />;
      case 'meeting':
        return <MeetingIcon />;
      case 'note':
        return <NoteIcon />;
      default:
        return <NoteIcon />;
    }
  };
  
  const getInteractionTypeColor = (type) => {
    switch (type) {
      case 'call':
        return 'primary';
      case 'email':
        return 'info';
      case 'meeting':
        return 'success';
      case 'note':
        return 'default';
      default:
        return 'default';
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!customer) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Customer not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/customers')}
        >
          Back to Customers
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Interaction History - {customer.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CalendarIcon />}
            onClick={() => navigate('/calendar')}
          >
            View Calendar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
          >
            New Interaction
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {customer.name}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {customer.email}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {customer.phone}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Company
                  </Typography>
                  <Typography variant="body1">
                    {customer.company}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={customer.status} 
                    color={customer.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  View Customer Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interaction Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Interactions
                  </Typography>
                  <Typography variant="h5">
                    {interactions.length}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Interaction
                  </Typography>
                  <Typography variant="body1">
                    {interactions.length > 0 
                      ? new Date(
                          Math.max(...interactions.map(i => new Date(i.date).getTime()))
                        ).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Interaction Types
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {['call', 'email', 'meeting', 'note'].map(type => {
                      const count = interactions.filter(i => i.type === type).length;
                      if (count === 0) return null;
                      
                      return (
                        <Chip 
                          key={type}
                          label={`${type}: ${count}`}
                          color={getInteractionTypeColor(type)}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0 }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {interactions.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No interactions recorded" 
                    secondary="Create a new interaction using the button above"
                  />
                </ListItem>
              ) : (
                interactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((interaction) => (
                    <ListItem
                      key={interaction.id}
                      alignItems="flex-start"
                      divider
                      secondaryAction={
                        <Box>
                          <IconButton 
                            edge="end" 
                            aria-label="edit"
                            onClick={() => handleEditDialogOpen(interaction)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDeleteDialogOpen(interaction)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getInteractionTypeColor(interaction.type) + '.main' }}>
                          {getInteractionIcon(interaction.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {interaction.description}
                            </Typography>
                            <Chip
                              label={interaction.type}
                              color={getInteractionTypeColor(interaction.type)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, mt: 0.5 }}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(interaction.date).toLocaleString()}
                                {interaction.duration && ` (${interaction.duration} minutes)`}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {interaction.user_name}
                              </Typography>
                            </Box>
                            
                            {interaction.notes && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ display: 'block', mb: 1 }}
                              >
                                {interaction.notes}
                              </Typography>
                            )}
                            
                            {interaction.location && (
                              <Typography variant="body2" color="text.secondary">
                                Location: {interaction.location}
                              </Typography>
                            )}
                            
                            {interaction.attachments && interaction.attachments.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Attachments:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                  {interaction.attachments.map((file, index) => (
                                    <Chip 
                                      key={index}
                                      label={file}
                                      size="small"
                                      onClick={() => {}} // Would handle download in real app
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Create Interaction Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Interaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Date and Time"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            
            {(formData.type === 'call' || formData.type === 'meeting') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
            
            {formData.type === 'meeting' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateSubmit} 
            variant="contained"
            disabled={!formData.description}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Interaction Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Edit Interaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Date and Time"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            
            {(formData.type === 'call' || formData.type === 'meeting') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
            
            {formData.type === 'meeting' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            disabled={!formData.description}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Interaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this interaction? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractionDetailPage;