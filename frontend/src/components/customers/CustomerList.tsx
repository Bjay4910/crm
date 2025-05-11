import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllCustomers, deleteCustomer, Customer } from '../../services/customerService';
import { useAuth } from '../../utils/AuthContext';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, searchTerm, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const filters: Record<string, any> = {};
      
      if (searchTerm) {
        filters.name = searchTerm;
      }
      
      const result = await getAllCustomers(
        rowsPerPage,
        page * rowsPerPage,
        sortBy,
        sortOrder,
        filters
      );
      
      setCustomers(result.customers);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
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
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Customers
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search by name"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={() => navigate('/customers/new')}
          >
            Add Customer
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => handleSort('name')}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Name
                  {sortBy === 'name' && (
                    <FilterIcon
                      fontSize="small"
                      sx={{
                        ml: 0.5,
                        transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('email')}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Email
                  {sortBy === 'email' && (
                    <FilterIcon
                      fontSize="small"
                      sx={{
                        ml: 0.5,
                        transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>Phone</TableCell>
              <TableCell 
                onClick={() => handleSort('company')}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Company
                  {sortBy === 'company' && (
                    <FilterIcon
                      fontSize="small"
                      sx={{
                        ml: 0.5,
                        transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('status')}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Status
                  {sortBy === 'status' && (
                    <FilterIcon
                      fontSize="small"
                      sx={{
                        ml: 0.5,
                        transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none'
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status || 'active'}
                      color={getStatusColor(customer.status || 'active') as any}
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
                    {isAdmin && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(customer.id!)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
};

export default CustomerList;