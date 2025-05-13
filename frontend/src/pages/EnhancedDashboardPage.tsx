import React, { useState, useEffect, ReactNode } from 'react';
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
  CircularProgress,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Type definitions
interface CustomerTrendData {
  month: string;
  active: number;
  total: number;
}

interface InteractionData {
  name: string;
  value: number;
}

interface Customer {
  id: number;
  name: string;
  interactions: number;
  revenue: number;
}

interface Activity {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  date: string;
  user: string;
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

// Mock data for charts
const customerTrendData: CustomerTrendData[] = [
  { month: 'Jan', active: 40, total: 50 },
  { month: 'Feb', active: 45, total: 60 },
  { month: 'Mar', active: 50, total: 70 },
  { month: 'Apr', active: 65, total: 80 },
  { month: 'May', active: 70, total: 90 },
  { month: 'Jun', active: 90, total: 100 }
];

const interactionData: InteractionData[] = [
  { name: 'Calls', value: 35 },
  { name: 'Emails', value: 45 },
  { name: 'Meetings', value: 15 },
  { name: 'Notes', value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const topCustomersData: Customer[] = [
  { id: 1, name: 'Acme Inc.', interactions: 35, revenue: 150000 },
  { id: 2, name: 'Beta LLC', interactions: 28, revenue: 120000 },
  { id: 3, name: 'Gamma Corp', interactions: 24, revenue: 100000 },
  { id: 4, name: 'Delta Group', interactions: 20, revenue: 90000 },
  { id: 5, name: 'Epsilon SA', interactions: 18, revenue: 80000 }
];

const recentActivityData: Activity[] = [
  { 
    id: 1, 
    type: 'call', 
    description: 'Call with Acme Inc. about new contract', 
    date: '2023-05-11T14:30:00', 
    user: 'John Doe' 
  },
  { 
    id: 2, 
    type: 'email', 
    description: 'Sent proposal to Beta LLC', 
    date: '2023-05-11T11:00:00', 
    user: 'Jane Smith' 
  },
  { 
    id: 3, 
    type: 'meeting', 
    description: 'Product demo with Gamma Corp', 
    date: '2023-05-10T16:00:00', 
    user: 'John Doe' 
  },
  { 
    id: 4, 
    type: 'note', 
    description: 'Delta Group requested follow-up next week', 
    date: '2023-05-10T10:15:00', 
    user: 'Jane Smith' 
  }
];

const EnhancedDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<string>('month');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };
  
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };
  
  const handleTimeRangeChange = (event: SelectChangeEvent): void => {
    setTimeRange(event.target.value);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<TodayIcon />}>
            Export Report
          </Button>
        </Box>
      </Box>
      
      {/* KPI Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">Total Customers</Typography>
                <TrendingUpIcon color="success" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>100</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpwardIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  12% from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">Active Customers</Typography>
                <TrendingUpIcon color="success" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>90</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpwardIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  8% from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">New Leads</Typography>
                <TrendingUpIcon color="success" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>24</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowUpwardIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                  15% from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">Interactions</Typography>
                <TrendingDownIcon color="error" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>156</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ArrowDownwardIcon color="error" fontSize="small" />
                <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                  3% from last {timeRange}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Customer Growth</Typography>
              <IconButton size="small" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Download CSV</MenuItem>
                <MenuItem onClick={handleMenuClose}>Download PDF</MenuItem>
                <MenuItem onClick={handleMenuClose}>View Full Report</MenuItem>
              </Menu>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={customerTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Total Customers"
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#82ca9d" 
                  name="Active Customers" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Interaction Types</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={interactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {interactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tabs Section */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="Top Customers" />
            <Tab label="Recent Activity" />
            <Tab label="Upcoming Tasks" />
          </Tabs>
        </Box>
        
        {/* Top Customers Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Interactions</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCustomersData.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell component="th" scope="row">
                      {customer.name}
                    </TableCell>
                    <TableCell align="right">{customer.interactions}</TableCell>
                    <TableCell align="right">${customer.revenue.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Recent Activity Tab */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {recentActivityData.map((activity) => (
              <ListItem key={activity.id} divider>
                <ListItemText
                  primary={activity.description}
                  secondary={`${activity.type.toUpperCase()} - ${new Date(activity.date).toLocaleString()} - ${activity.user}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
        
        {/* Upcoming Tasks Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
            No upcoming tasks scheduled.
          </Typography>
        </TabPanel>
      </Paper>
      
      {/* Performance Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Sales Performance</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={customerTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Revenue ($k)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Conversion Rate</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  { month: 'Jan', rate: 15 },
                  { month: 'Feb', rate: 18 },
                  { month: 'Mar', rate: 17 },
                  { month: 'Apr', rate: 20 },
                  { month: 'May', rate: 25 },
                  { month: 'Jun', rate: 30 }
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#ff7300" 
                  name="Conversion Rate (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// TabPanel component for tab content
const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default EnhancedDashboardPage;