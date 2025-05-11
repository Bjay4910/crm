import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import { useAuth } from '../../utils/AuthContext';
import { getAllCustomers } from '../../services/customerService';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    recentCustomers: []
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      // Get customer counts
      const result = await getAllCustomers(100, 0); // Get up to 100 customers
      
      const activeCustomers = result.customers.filter(c => c.status === 'active');
      const inactiveCustomers = result.customers.filter(c => c.status === 'inactive');
      const recentCustomers = [...result.customers]
        .sort((a, b) => {
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        })
        .slice(0, 5);
      
      setMetrics({
        totalCustomers: result.total,
        activeCustomers: activeCustomers.length,
        inactiveCustomers: inactiveCustomers.length,
        recentCustomers: recentCustomers
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome{currentUser ? `, ${currentUser.username}` : ''}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Total Customers" />
            <Divider />
            <CardContent>
              <Typography variant="h3" align="center">
                {metrics.totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Active Customers" />
            <Divider />
            <CardContent>
              <Typography variant="h3" align="center" color="success.main">
                {metrics.activeCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Inactive Customers" />
            <Divider />
            <CardContent>
              <Typography variant="h3" align="center" color="error.main">
                {metrics.inactiveCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '100%' }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Recent Customers
              </Typography>
              <Divider />
              <List>
                {metrics.recentCustomers.length > 0 ? (
                  metrics.recentCustomers.map((customer: any) => (
                    <ListItem key={customer.id} divider>
                      <ListItemText
                        primary={customer.name}
                        secondary={`Added: ${new Date(customer.created_at || '').toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recent customers" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '100%' }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Quick Tips
              </Typography>
              <Divider />
              <List>
                <ListItem divider>
                  <ListItemText
                    primary="Add New Customers"
                    secondary="Use the Customers menu to add new customers to your CRM"
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText
                    primary="Record Interactions"
                    secondary="Keep track of all your customer communications"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Filter and Sort"
                    secondary="Use the filter and sort options to find customers quickly"
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;