import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { Order, OrderStatus } from '@/types';

// Get user orders
export const useUserOrders = () => {
  return useQuery({
    queryKey: ['orders', 'user'],
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/orders');
      return data;
    },
  });
};

// Get single order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: Array<{ menuItemId: string; quantity: number }>) => {
      const { data } = await api.post<Order>('/orders', { items });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Update order status (Admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data } = await api.patch<Order>(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
  });
};

// Get all orders (Admin)
export const useAllOrders = (status?: OrderStatus) => {
  return useQuery({
    queryKey: ['orders', 'all', status],
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/orders/all', {
        params: status ? { status } : {},
      });
      return data;
    },
  });
};
