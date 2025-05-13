import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';

// For demo purposes - in a real app would use API
const MOCK_USERS = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', created_at: '2023-01-01T00:00:00Z' },
  { id: 2, username: 'johndoe', email: 'john@example.com', role: 'user', status: 'active', created_at: '2023-01-15T00:00:00Z' },
  { id: 3, username: 'janedoe', email: 'jane@example.com', role: 'user', status: 'active', created_at: '2023-02-01T00:00:00Z' },
  { id: 4, username: 'inactive_user', email: 'inactive@example.com', role: 'user', status: 'inactive', created_at: '2023-03-01T00:00:00Z' }
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  
  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = () => {
      setTimeout(() => {
        const filteredUsers = MOCK_USERS.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setUsers(filteredUsers);
        setTotalUsers(filteredUsers.length);
        setLoading(false);
      }, 1000);
    };
    
    setLoading(true);
    fetchUsers();
  }, [searchTerm]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };
  
  const handleEditSubmit = () => {
    // Simulate API call to update user
    setTimeout(() => {
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      setEditDialogOpen(false);
    }, 500);
  };
  
  const handleDeleteConfirm = () => {
    // Simulate API call to delete user
    setTimeout(() => {
      const updatedUsers = users.filter(user => user.id !== currentUser.id);
      setUsers(updatedUsers);
      setTotalUsers(updatedUsers.length);
      setDeleteDialogOpen(false);
    }, 500);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      default:
        return 'primary';
    }
  };
  
  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search users..."
            size="small"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add User
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              color={getRoleColor(user.role)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.status}
                              color={getStatusColor(user.status)}
                              size="small"
                              icon={user.status === 'active' ? <LockOpenIcon /> : <LockIcon />}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditClick(user)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteClick(user)}
                              disabled={user.role === 'admin'} // Prevent deleting admin users
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalUsers}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{currentUser?.username}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;