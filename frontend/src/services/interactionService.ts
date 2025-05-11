import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:5000/api/interactions';

export interface Interaction {
  id?: number;
  customer_id: number;
  user_id?: number;
  type: string;
  description: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
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
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  
  const response = await axios.get(`${API_URL}/customer/${customerId}?${params.toString()}`, {
    headers: authHeader()
  });
  
  return response.data;
};

export const getInteractionById = async (id: number): Promise<Interaction> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: authHeader()
  });
  
  return response.data;
};

export const createInteraction = async (interaction: Interaction): Promise<Interaction> => {
  const response = await axios.post(API_URL, interaction, {
    headers: authHeader()
  });
  
  return response.data;
};

export const updateInteraction = async (id: number, interaction: Partial<Interaction>): Promise<Interaction> => {
  const response = await axios.put(`${API_URL}/${id}`, interaction, {
    headers: authHeader()
  });
  
  return response.data;
};

export const deleteInteraction = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: authHeader()
  });
};