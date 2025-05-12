import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:8000/api/customers';

export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetCustomersResponse {
  customers: Customer[];
  total: number;
  limit: number;
  offset: number;
}

export const getAllCustomers = async (
  limit: number = 20,
  offset: number = 0,
  sortBy: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
  filters: Record<string, any> = {}
): Promise<GetCustomersResponse> => {
  // Build query params
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value.toString());
    }
  });
  
  const response = await axios.get(`${API_URL}?${params.toString()}`, {
    headers: authHeader()
  });
  
  return response.data;
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: authHeader()
  });
  
  return response.data;
};

export const createCustomer = async (customer: Customer): Promise<Customer> => {
  const response = await axios.post(API_URL, customer, {
    headers: authHeader()
  });
  
  return response.data;
};

export const updateCustomer = async (id: number, customer: Partial<Customer>): Promise<Customer> => {
  const response = await axios.put(`${API_URL}/${id}`, customer, {
    headers: authHeader()
  });
  
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: authHeader()
  });
};