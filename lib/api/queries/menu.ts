import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { MenuItem } from '@/types';

// Get all menu items
export const useMenuItems = (category?: 'food' | 'drink') => {
  return useQuery({
    queryKey: ['menu', category],
    queryFn: async () => {
      const { data } = await api.get<MenuItem[]>('/menu', {
        params: category ? { category } : {},
      });
      return data;
    },
  });
};

// Get single menu item
export const useMenuItem = (id: string) => {
  return useQuery({
    queryKey: ['menu', id],
    queryFn: async () => {
      const { data } = await api.get<MenuItem>(`/menu/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create menu item (Admin)
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await api.post<MenuItem>('/menu', menuItem);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
};

// Update menu item (Admin)
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...menuItem }: Partial<MenuItem> & { id: string }) => {
      const { data } = await api.put<MenuItem>(`/menu/${id}`, menuItem);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      queryClient.invalidateQueries({ queryKey: ['menu', variables.id] });
    },
  });
};

// Delete menu item (Admin)
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/menu/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
};
