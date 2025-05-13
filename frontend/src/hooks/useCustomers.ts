import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  Customer,
  GetCustomersResponse
} from '../services/customerService';
import { QueryKeys } from '../utils/queryClient';

// Hook for fetching all customers with optional filtering
export const useCustomers = (
  limit: number = 20, 
  offset: number = 0, 
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: QueryKeys.customerSearch({ limit, offset, sortBy, sortOrder, ...filters }),
    queryFn: () => getAllCustomers(limit, offset, sortBy, sortOrder, filters)
  });
};

// Hook for fetching a single customer by ID
export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.customer(id),
    queryFn: () => getCustomerById(id),
    enabled: !!id // Only run if ID is provided
  });
};

// Hook for creating a new customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newCustomer: Customer) => createCustomer(newCustomer),
    onSuccess: () => {
      // Invalidate the customers list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: QueryKeys.customers });
    }
  });
};

// Hook for updating a customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, customer }: { id: number; customer: Partial<Customer> }) => 
      updateCustomer(id, customer),
    onSuccess: (data, variables) => {
      // Update both the list and the individual customer in the cache
      queryClient.invalidateQueries({ queryKey: QueryKeys.customers });
      queryClient.invalidateQueries({ queryKey: QueryKeys.customer(variables.id) });
    }
  });
};

// Hook for deleting a customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and remove from cache
      queryClient.invalidateQueries({ queryKey: QueryKeys.customers });
      queryClient.removeQueries({ queryKey: QueryKeys.customer(deletedId) });
    }
  });
};