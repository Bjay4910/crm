import React, { useState, useEffect } from 'react';
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
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';
import { useKeyboardNavigation } from '../utils/useKeyboardNavigation';

const DRAWER_WIDTH = 240;

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avatarType, setAvatarType] = useState<'initials' | 'logo'>('logo');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  // Initialize keyboard navigation - this sets up the global shortcuts
  useKeyboardNavigation();
  
  useEffect(() => {
    // In a real app, you might fetch the user's avatar preferences from the backend
    const getUserPreferences = () => {
      // For demonstration, we'll use the logo by default
      setAvatarType('logo');
    };
    
    getUserPreferences();
  }, []);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };
  
  // Enhanced menu items with better icons and animations
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
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser?.username) return 'U';
    
    const nameParts = currentUser.username.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return currentUser.username[0].toUpperCase();
  };
  
  // Generate avatar component based on type
  const getAvatarComponent = () => {
    if (avatarType === 'logo') {
      return (
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'primary.main',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.1)' }
          }}
          alt="Company Logo"
        >
          <span style={{ 
            fontFamily: '"Montserrat", sans-serif', 
            fontWeight: 'bold', 
            fontSize: '16px' 
          }}>
            BJ
          </span>
        </Avatar>
      );
    }
    
    return (
      <Avatar 
        sx={{ 
          width: 32, 
          height: 32, 
          bgcolor: 'secondary.main',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.1)' }
        }}
      >
        {getUserInitials()}
      </Avatar>
    );
  };
  
  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src="/logo192.png"
              alt="CRM Logo"
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 1,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'rotate(10deg)' }
              }}
            />
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
            <ListItem 
              button 
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
          
          {/* Theme Toggle Button */}
          <ThemeToggle aria-label="Toggle dark/light mode" />
          
          {/* Keyboard Shortcuts Help */}
          <KeyboardShortcutsHelp />
          
          {currentUser && (
            <div>
              <Tooltip title="Account settings">
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  {getAvatarComponent()}
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
                    {currentUser.email}
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
          )}
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
    </Box>
  );
};

export default DashboardLayout;