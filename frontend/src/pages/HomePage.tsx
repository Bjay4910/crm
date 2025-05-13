import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha
} from '@mui/material';
import {
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  DeviceHub as DeviceHubIcon
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock features
  const features = [
    {
      title: 'Customer Management',
      description: 'Organize and manage all your customer data in one place',
      icon: <PeopleIcon fontSize="large" color="primary" />
    },
    {
      title: 'Interaction Tracking',
      description: 'Log and track all customer interactions for better follow-ups',
      icon: <TimelineIcon fontSize="large" color="primary" />
    },
    {
      title: 'Interactive Dashboard',
      description: 'Get real-time insights with customizable dashboards',
      icon: <DashboardIcon fontSize="large" color="primary" />
    }
  ];

  // Mock benefits
  const benefits = [
    {
      icon: <SecurityIcon />,
      text: 'Secure user authentication and authorization'
    },
    {
      icon: <SpeedIcon />,
      text: 'Fast and responsive user interface'
    },
    {
      icon: <DeviceHubIcon />,
      text: 'Seamless integration between frontend and backend'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          pt: 8,
          pb: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `radial-gradient(circle, ${theme.palette.common.white} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                fontWeight="bold"
                gutterBottom
              >
                Simplify Customer Relationships
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{ opacity: 0.9, mb: 4 }}
              >
                Streamline your customer interactions, boost engagement, and drive growth with our comprehensive CRM solution.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button 
                  component={RouterLink}
                  to="/login"
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: 4
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: alpha(theme.palette.common.white, 0.1)
                    }
                  }}
                >
                  Register
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="/assets/dashboard-preview.png" 
                alt="CRM Dashboard Preview"
                sx={{ 
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  boxShadow: 3,
                  borderRadius: 2,
                  transform: 'perspective(1500px) rotateY(-15deg)',
                  opacity: 0.9
                }}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          Key Features
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Everything you need to manage your customer relationships effectively
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
                elevation={3}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h3" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h2"
                variant="h3"
                fontWeight="bold"
                gutterBottom
              >
                Why Choose Our CRM?
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Our CRM solution is designed to help businesses of all sizes streamline their customer relationship management processes.
              </Typography>
              
              <List>
                {benefits.map((benefit, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon>
                        {benefit.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={benefit.text} 
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                    {index < benefits.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 4, fontWeight: 'bold', borderRadius: 2 }}
              >
                Get Started Now
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 25%, transparent 25%, transparent 50%, ${alpha(theme.palette.primary.light, 0.1)} 50%, ${alpha(theme.palette.primary.light, 0.1)} 75%, transparent 75%, transparent)`,
                  backgroundSize: '20px 20px',
                }}
              >
                <Box sx={{ p: 3, bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Ready to boost your customer relationships?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Join thousands of businesses already using our CRM system to improve customer satisfaction and drive sales.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <Typography variant="h2" component="p" color="primary" fontWeight="bold">
                      100%
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" align="center">
                    Customer satisfaction
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: theme.palette.secondary.main, color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="center" textAlign="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                Start managing your customers today
              </Typography>
              <Typography variant="subtitle1" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                Join our platform and take your customer relationships to the next level
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  px: 5, 
                  py: 1.5, 
                  fontWeight: 'bold',
                  borderRadius: 2,
                  bgcolor: 'white',
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.9)
                  }
                }}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} CRM System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;