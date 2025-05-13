import axios from 'axios';
import { authHeader } from './authService';
import { handleApiError } from '../utils/errorHandling';

// Get the current hostname to determine the API URL
const getApiBaseUrl = () => {
  // If we're running in development mode with frontend on port 3000
  if (window.location.port === '3000') {
    return 'http://localhost:8000/api';
  }
  // If we're running from the backend (either prod or the unified dev approach)
  return `${window.location.origin}/api`;
};

const API_URL = `${getApiBaseUrl()}/customers`;

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

// Enhanced response types reflecting the new API structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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
  try {
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
    
    const response = await axios.get<ApiResponse<GetCustomersResponse>>(`${API_URL}?${params.toString()}`, {
      headers: authHeader()
    });
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await axios.get<ApiResponse<Customer>>(`${API_URL}/${id}`, {
      headers: authHeader()
    });
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createCustomer = async (customer: Customer): Promise<Customer> => {
  try {
    const response = await axios.post<ApiResponse<Customer>>(API_URL, customer, {
      headers: authHeader()
    });
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCustomer = async (id: number, customer: Partial<Customer>): Promise<Customer> => {
  try {
    const response = await axios.put<ApiResponse<Customer>>(`${API_URL}/${id}`, customer, {
      headers: authHeader()
    });
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: authHeader()
    });
  } catch (error) {
    throw handleApiError(error);
  }
};