import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  
  useEffect(() => {
    // Simulate API call
    const loadData = () => {
      setTimeout(() => {
        setStats([
          { title: 'Total Customers', value: 42, color: 'primary.main' },
          { title: 'Active Customers', value: 38, color: 'success.main' },
          { title: 'Pending Tasks', value: 7, color: 'warning.main' },
          { title: 'New Leads', value: 12, color: 'info.main' }
        ]);
        setLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, Demo User!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{stat.title}</Typography>
                <Typography 
                  variant="h3" 
                  align="center" 
                  sx={{ color: stat.color, fontWeight: 'bold' }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Customers</Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem divider>
                <ListItemText 
                  primary="Acme Inc." 
                  secondary="Added: Today" 
                />
              </ListItem>
              <ListItem divider>
                <ListItemText 
                  primary="Johnson & Partners" 
                  secondary="Added: Yesterday" 
                />
              </ListItem>
              <ListItem divider>
                <ListItemText 
                  primary="XYZ Corporation" 
                  secondary="Added: 3 days ago" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Smith Enterprises" 
                  secondary="Added: 5 days ago" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">Recent Activities</Typography>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                size="small"
                onClick={() => navigate('/calendar')}
              >
                Calendar View
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem divider>
                <ListItemText 
                  primary="Meeting with Acme Inc." 
                  secondary="Scheduled: Tomorrow at 10:00 AM" 
                />
              </ListItem>
              <ListItem divider>
                <ListItemText 
                  primary="Call with Johnson & Partners" 
                  secondary="Completed: Today at 2:00 PM" 
                />
              </ListItem>
              <ListItem divider>
                <ListItemText 
                  primary="Email to XYZ Corporation" 
                  secondary="Sent: Yesterday at 9:30 AM" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Follow-up with Smith Enterprises" 
                  secondary="Due: In 2 days" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;