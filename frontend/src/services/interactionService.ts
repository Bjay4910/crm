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

const API_URL = `${getApiBaseUrl()}/interactions`;

export interface Interaction {
  id?: number;
  customer_id: number;
  user_id?: number;
  type: string;
  description: string;
  date?: string;
  notes?: string;
  duration?: number;
  location?: string;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
}

// Enhanced response types reflecting the new API structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface GetInteractionsResponse {
  interactions: Interaction[];
  total: number;
  limit: number;
  offset: number;
}

export const getInteractionsByCustomerId = async (
  customerId: number,
  limit: number = 20,
  offset: number = 0
): Promise<GetInteractionsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await axios.get<ApiResponse<GetInteractionsResponse>>(
      `${API_URL}/customer/${customerId}?${params.toString()}`,
      { headers: authHeader() }
    );
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllInteractions = async (
  limit: number = 20,
  offset: number = 0,
  sortBy: string = 'date',
  sortOrder: 'asc' | 'desc' = 'desc',
  filters: Record<string, any> = {}
): Promise<GetInteractionsResponse> => {
  try {
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
    
    const response = await axios.get<ApiResponse<GetInteractionsResponse>>(
      `${API_URL}?${params.toString()}`,
      { headers: authHeader() }
    );
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getInteractionById = async (id: number): Promise<Interaction> => {
  try {
    const response = await axios.get<ApiResponse<Interaction>>(
      `${API_URL}/${id}`,
      { headers: authHeader() }
    );
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createInteraction = async (interaction: Interaction): Promise<Interaction> => {
  try {
    const response = await axios.post<ApiResponse<Interaction>>(
      API_URL,
      interaction,
      { headers: authHeader() }
    );
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateInteraction = async (id: number, interaction: Partial<Interaction>): Promise<Interaction> => {
  try {
    const response = await axios.put<ApiResponse<Interaction>>(
      `${API_URL}/${id}`,
      interaction,
      { headers: authHeader() }
    );
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteInteraction = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: authHeader()
    });
  } catch (error) {
    throw handleApiError(error);
  }
};