import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Fade
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationIcon,
  Speed as SpeedIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Demo user
  const user = {
    username: 'Demo User',
    email: 'demo@example.com'
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    navigate('/login');
    handleProfileMenuClose();
  };
  
  // Enhanced menu items with better icons
  const menuItems = [
    { 
      text: 'Home', 
      icon: <HomeIcon sx={{ transition: 'color 0.2s' }} />, 
      path: '/' 
    },
    { 
      text: 'Dashboard', 
      icon: <SpeedIcon sx={{ transition: 'color 0.2s' }} />, 
      path: '/dashboard' 
    },
    { 
      text: 'Customers', 
      icon: <PeopleIcon sx={{ transition: 'color 0.2s' }} />, 
      path: '/customers' 
    },
    { 
      text: 'Calendar', 
      icon: <CalendarIcon sx={{ transition: 'color 0.2s' }} />, 
      path: '/calendar' 
    }
  ];
  
  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              alt="CRM Logo"
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 1,
                bgcolor: 'primary.main',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'rotate(10deg)' }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 'bold', fontFamily: '"Montserrat", sans-serif' }}
              >
                BJ
              </Typography>
            </Avatar>
            <Typography 
              variant="h6" 
              noWrap
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              CRM System
            </Typography>
          </Box>
        </Fade>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <Fade 
            in={true} 
            timeout={500} 
            style={{ transitionDelay: `${index * 100}ms` }}
            key={item.text}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  transition: 'background-color 0.3s, transform 0.2s',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    borderRight: `4px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                  '&:hover': {
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path 
                      ? 'primary.main' 
                      : 'inherit',
                    transition: 'color 0.3s'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                    transition: 'font-weight 0.3s'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Fade>
        ))}
      </List>
    </div>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          transition: 'width 0.3s, margin-left 0.3s'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              transition: 'transform 0.2s',
              '&:hover': { transform: 'rotate(180deg)' }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {location.pathname.includes('/dashboard') && 'Dashboard'}
            {location.pathname.includes('/customers') && 'Customers'}
            {location.pathname.includes('/calendar') && 'Calendar'}
          </Typography>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              sx={{ 
                mr: 1,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <Badge color="error" badgeContent={3}>
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <div>
            <Tooltip title="Account settings">
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ fontWeight: 'bold', fontFamily: '"Montserrat", sans-serif' }}
                  >
                    BJ
                  </Typography>
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              sx={{ 
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  mt: 1.5,
                  boxShadow: 3
                }
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  {user.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleProfileMenuClose}
                sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              boxShadow: 1
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: 8, sm: 8 },
          transition: 'width 0.3s'
        }}
      >
        <Outlet />
      </Box>
      
      {/* Global animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default DashboardLayout;