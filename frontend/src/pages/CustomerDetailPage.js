import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock customer data
      if (id === '1') {
        setCustomer({
          id: 1,
          name: 'Acme Inc.',
          email: 'contact@acme.com',
          phone: '555-1234',
          company: 'Acme Corporation',
          status: 'active',
          created_at: '2023-01-15T12:00:00Z'
        });
        
        // Mock interactions data
        setInteractions([
          {
            id: 1,
            customer_id: 1,
            type: 'call',
            description: 'Initial sales call with marketing team',
            date: '2023-04-10T10:30:00Z',
            user_name: 'John Doe'
          },
          {
            id: 2,
            customer_id: 1,
            type: 'email',
            description: 'Sent proposal following up on meeting',
            date: '2023-04-12T14:00:00Z',
            user_name: 'Jane Smith'
          }
        ]);
      }
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      // Simulate API call
      setTimeout(() => {
        navigate('/customers');
      }, 1000);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'lead':
        return 'warning';
      default:
        return 'default';
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
          Customer Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/customers/edit/${id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">{customer.name}</Typography>
                <Chip
                  label={customer.status}
                  color={getStatusColor(customer.status)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              
              {customer.company && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {customer.company}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary">
                Customer since: {formatDate(customer.created_at)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {customer.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{customer.email}</Typography>
                </Box>
              )}
              
              {customer.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{customer.phone}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="customer tabs">
            <Tab label={`Interactions (${interactions.length})`} id="tab-0" />
            <Tab label="Notes" id="tab-1" />
            <Tab label="Documents" id="tab-2" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {/* Navigate to add interaction form */}}
            >
              Add Interaction
            </Button>
          </Box>
          
          {interactions.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No interactions recorded yet
            </Typography>
          ) : (
            <List>
              {interactions.map((interaction) => (
                <ListItem
                  key={interaction.id}
                  alignItems="flex-start"
                  divider
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          label={interaction.type}
                          color={getInteractionTypeColor(interaction.type)}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(interaction.date).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ display: 'block' }}>
                          {interaction.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          By: {interaction.user_name}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography color="text.secondary" align="center">
            No notes available
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography color="text.secondary" align="center">
            No documents available
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default CustomerDetailPage;