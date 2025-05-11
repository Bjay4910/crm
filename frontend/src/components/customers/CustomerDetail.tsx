import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerById, Customer } from '../../services/customerService';
import { getInteractionsByCustomerId, Interaction } from '../../services/interactionService';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import InteractionList from '../interactions/InteractionList';
import AddInteractionForm from '../interactions/AddInteractionForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CustomerDetail: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchCustomer(parseInt(id));
      fetchInteractions(parseInt(id));
    }
  }, [id]);

  const fetchCustomer = async (customerId: number) => {
    try {
      const data = await getCustomerById(customerId);
      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInteractions = async (customerId: number) => {
    try {
      const result = await getInteractionsByCustomerId(customerId);
      setInteractions(result.interactions);
      setTotalInteractions(result.total);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewInteraction = (interaction: Interaction) => {
    setInteractions([interaction, ...interactions]);
    setTotalInteractions(prev => prev + 1);
    setTabValue(0); // Switch back to interactions tab
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'lead':
        return 'warning';
      case 'opportunity':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!customer) {
    return <Typography>Customer not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Customer Details
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/customers/edit/${id}`)}
        >
          Edit
        </Button>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {customer.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <Chip
                  label={customer.status || 'active'}
                  color={getStatusColor(customer.status || 'active') as any}
                  size="small"
                />
              </Box>
              
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {customer.company && <>{customer.company}<br /></>}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Contact Information
              </Typography>
              <Divider sx={{ my: 1 }} />
              
              {customer.email && (
                <Typography variant="body2" gutterBottom>
                  Email: {customer.email}
                </Typography>
              )}
              
              {customer.phone && (
                <Typography variant="body2" gutterBottom>
                  Phone: {customer.phone}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Customer since: {new Date(customer.created_at || '').toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="customer tabs"
        >
          <Tab label={`Interactions (${totalInteractions})`} />
          <Tab label="Add Interaction" />
        </Tabs>
        
        <Box sx={{ p: 2 }}>
          <TabPanel value={tabValue} index={0}>
            <InteractionList
              interactions={interactions}
              customer={customer}
              onInteractionDeleted={() => fetchInteractions(parseInt(id!))}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <AddInteractionForm
              customerId={parseInt(id!)}
              onInteractionAdded={handleNewInteraction}
            />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerDetail;