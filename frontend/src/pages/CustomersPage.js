import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCustomers, setTotalCustomers] = useState(0);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call
    const loadData = () => {
      setTimeout(() => {
        const mockCustomers = [
          { id: 1, name: 'Acme Inc.', email: 'contact@acme.com', phone: '555-1234', company: 'Acme Corporation', status: 'active' },
          { id: 2, name: 'Beta LLC', email: 'info@beta.com', phone: '555-2345', company: 'Beta Limited', status: 'active' },
          { id: 3, name: 'Gamma Corp', email: 'hello@gamma.com', phone: '555-3456', company: 'Gamma Corporation', status: 'inactive' },
          { id: 4, name: 'Delta Group', email: 'support@delta.com', phone: '555-4567', company: 'Delta Group', status: 'active' },
          { id: 5, name: 'Epsilon SA', email: 'info@epsilon.com', phone: '555-5678', company: 'Epsilon', status: 'active' }
        ];
        
        let filteredCustomers = mockCustomers;
        if (searchTerm) {
          filteredCustomers = mockCustomers.filter(
            customer => customer.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setCustomers(filteredCustomers);
        setTotalCustomers(filteredCustomers.length);
        setLoading(false);
      }, 1000);
    };
    
    loadData();
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
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
      setTotalCustomers(totalCustomers - 1);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Customers
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search customers..."
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
            onClick={() => navigate('/customers/new')}
          >
            Add Customer
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((customer) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.company}</TableCell>
                          <TableCell>
                            <Chip
                              label={customer.status}
                              color={getStatusColor(customer.status || 'default')}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/customers/${customer.id}`)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => navigate(`/customers/edit/${customer.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(customer.id)}
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
              count={totalCustomers}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CustomersPage;