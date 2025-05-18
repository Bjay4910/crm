import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
  Fade
} from '@mui/material';
import {
  AddCircle as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Notifications as NotificationIcon,
  NotificationsActive as NotificationsActiveIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface DashboardStat {
  title: string;
  value: number | string;
  color: string;
}

// Sample data for charts
const customerStatusData = [
  { name: 'Active', value: 42, color: '#4caf50' },
  { name: 'Inactive', value: 8, color: '#f44336' },
  { name: 'Potential', value: 15, color: '#2196f3' },
  { name: 'Other', value: 5, color: '#ff9800' }
];

const leadSourceData = [
  { name: 'Website', leads: 18 },
  { name: 'Referral', leads: 12 },
  { name: 'Social Media', leads: 8 },
  { name: 'Email', leads: 5 },
  { name: 'Other', leads: 3 }
];

const notifications = [
  { id: 1, message: 'New lead from website form', isUrgent: true, time: '10 min ago' },
  { id: 2, message: 'Follow-up required with Acme Inc.', isUrgent: true, time: '1 hour ago' },
  { id: 3, message: 'Meeting reminder: Johnson & Partners', isUrgent: false, time: 'Tomorrow, 10:00 AM' }
];

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [greeting, setGreeting] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Get current time for personalized greeting
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    
    setGreeting(getGreeting());
  }, []);
  
  useEffect(() => {
    // In a real app, you would fetch data from your API here
    const loadData = () => {
      setTimeout(() => {
        setStats([
          { title: 'Total Customers', value: 42, color: 'primary.main' },
          { title: 'Active Customers', value: 38, color: 'success.main' },
          { title: 'Pending Tasks', value: 7, color: 'warning.main' },
          { title: 'New Leads', value: 12, color: 'info.main' }
        ]);
        setLoading(false);
      }, 1000); // Simulate network delay
    };
    
    loadData();
  }, []);
  
  // Quick actions handlers
  const handleAddCustomer = () => navigate('/customers/new');
  const handleAddCall = () => navigate('/interactions/new', { state: { type: 'call' } });
  const handleAddEmail = () => navigate('/interactions/new', { state: { type: 'email' } });
  const handleAddEvent = () => navigate('/calendar');
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Fade in={true} timeout={800}>
      <Box>
        {/* Search bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3, 
            p: 1.5, 
            borderRadius: 2, 
            backgroundColor: 'background.paper',
            boxShadow: 1,
            transition: 'all 0.3s ease'
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <input
            placeholder="Search customers, interactions, or leads..."
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
              fontSize: '1rem'
            }}
          />
        </Box>
        
        {/* Personalized greeting */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {greeting}, {currentUser?.username || 'User'}!
          </Typography>
          
          {/* Notification icon */}
          <Box sx={{ position: 'relative' }}>
            <Tooltip title="Notifications">
              <IconButton 
                onClick={() => setShowNotifications(!showNotifications)}
                sx={{ 
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                {notifications.some(n => n.isUrgent) 
                  ? <NotificationsActiveIcon color="error" /> 
                  : <NotificationIcon />
                }
              </IconButton>
            </Tooltip>
            
            {/* Notification popup */}
            {showNotifications && (
              <Paper 
                sx={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  width: 320, 
                  maxHeight: 400, 
                  overflow: 'auto',
                  zIndex: 10,
                  boxShadow: 3,
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <List>
                  <ListItem sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Notifications
                    </Typography>
                  </ListItem>
                  <Divider />
                  {notifications.map(notification => (
                    <ListItem key={notification.id} divider sx={{
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'action.hover' },
                      ...(notification.isUrgent && { 
                        borderLeft: '4px solid',
                        borderLeftColor: 'error.main'
                      })
                    }}>
                      <ListItemText
                        primary={notification.message}
                        secondary={notification.time}
                        primaryTypographyProps={{
                          fontWeight: notification.isUrgent ? 'medium' : 'regular'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Box>
        
        {/* Quick Actions Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.3s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
          }}
        >
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleAddCustomer}
              sx={{ 
                minWidth: 180,
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              Add Customer
            </Button>
            
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<PhoneIcon />}
              onClick={handleAddCall}
              sx={{ 
                minWidth: 180,
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              Log Call
            </Button>
            
            <Button 
              variant="contained" 
              color="info" 
              startIcon={<EmailIcon />}
              onClick={handleAddEmail}
              sx={{ 
                minWidth: 180,
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              Log Email
            </Button>
            
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<EventIcon />}
              onClick={handleAddEvent}
              sx={{ 
                minWidth: 180,
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              Schedule Event
            </Button>
          </Stack>
        </Paper>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 }
              }}>
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
        
        {/* Data Visualizations */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Customer Status Distribution</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Leads by Source</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={leadSourceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="leads" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 2, 
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 2 }
            }}>
              <Typography variant="h6" gutterBottom>Recent Customers</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem divider sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="Acme Inc." 
                    secondary="Added: Today" 
                  />
                </ListItem>
                <ListItem divider sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="Johnson & Partners" 
                    secondary="Added: Yesterday" 
                  />
                </ListItem>
                <ListItem divider sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="XYZ Corporation" 
                    secondary="Added: 3 days ago" 
                  />
                </ListItem>
                <ListItem sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="Smith Enterprises" 
                    secondary="Added: 5 days ago" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 2, 
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: 2 }
            }}>
              <Typography variant="h6" gutterBottom>Recent Activities</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem divider sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="Meeting with Acme Inc." 
                    secondary="Scheduled: Tomorrow at 10:00 AM" 
                  />
                </ListItem>
                <ListItem divider sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="Call with Johnson & Partners" 
                    secondary="Completed: Today at 2:00 PM" 
                  />
                </ListItem>
                <ListItem divider sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="Email to XYZ Corporation" 
                    secondary="Sent: Yesterday at 9:30 AM" 
                  />
                </ListItem>
                <ListItem sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: 'action.hover' } 
                }}>
                  <ListItemText 
                    primary="Follow-up with Smith Enterprises" 
                    secondary="Due: In 2 days" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Add a global style for animations */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default DashboardPage;