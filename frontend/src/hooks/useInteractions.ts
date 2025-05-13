import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getInteractionsByCustomerId,
  getAllInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  Interaction,
  GetInteractionsResponse
} from '../services/interactionService';
import { QueryKeys } from '../utils/queryClient';

// Hook for fetching all interactions with optional filtering
export const useInteractions = (
  limit: number = 20, 
  offset: number = 0, 
  sortBy: string = 'date',
  sortOrder: 'asc' | 'desc' = 'desc',
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: QueryKeys.interactions,
    queryFn: () => getAllInteractions(limit, offset, sortBy, sortOrder, filters)
  });
};

// Hook for fetching interactions for a specific customer
export const useCustomerInteractions = (
  customerId: number,
  limit: number = 20,
  offset: number = 0
) => {
  return useQuery({
    queryKey: QueryKeys.customerInteractions(customerId),
    queryFn: () => getInteractionsByCustomerId(customerId, limit, offset),
    enabled: !!customerId // Only run if customerId is provided
  });
};

// Hook for fetching a single interaction
export const useInteraction = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.interaction(id),
    queryFn: () => getInteractionById(id),
    enabled: !!id // Only run if ID is provided
  });
};

// Hook for creating a new interaction
export const useCreateInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newInteraction: Interaction) => createInteraction(newInteraction),
    onSuccess: (_, variables) => {
      // Invalidate all potentially affected queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.interactions });
      queryClient.invalidateQueries({ 
        queryKey: QueryKeys.customerInteractions(variables.customer_id)
      });
    }
  });
};

// Hook for updating an interaction
export const useUpdateInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, interaction }: { id: number; interaction: Partial<Interaction> }) => 
      updateInteraction(id, interaction),
    onSuccess: (data, variables) => {
      // Invalidate all potentially affected queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.interactions });
      if (data.customer_id) {
        queryClient.invalidateQueries({ 
          queryKey: QueryKeys.customerInteractions(data.customer_id)
        });
      }
      queryClient.invalidateQueries({ queryKey: QueryKeys.interaction(variables.id) });
    }
  });
};

// Hook for deleting an interaction
export const useDeleteInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteInteraction(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and remove from cache
      queryClient.invalidateQueries({ queryKey: QueryKeys.interactions });
      queryClient.removeQueries({ queryKey: QueryKeys.interaction(deletedId) });
      
      // We don't know which customer this interaction belonged to after deletion,
      // so we don't invalidate specific customer interactions
    }
  });
};