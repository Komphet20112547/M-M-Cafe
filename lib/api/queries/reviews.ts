import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { Review } from '@/types';

// Get all reviews
export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await api.get<Review[]>('/reviews');
      return data;
    },
  });
};

// Get average rating
export const useAverageRating = () => {
  return useQuery({
    queryKey: ['reviews', 'average'],
    queryFn: async () => {
      const { data } = await api.get<{ average: number; count: number }>('/reviews/average');
      return data;
    },
  });
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: { rating: number; comment?: string }) => {
      const { data } = await api.post<Review>('/reviews', review);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'average'] });
    },
  });
};

// Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...review }: Partial<Review> & { id: string }) => {
      const { data } = await api.put<Review>(`/reviews/${id}`, review);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'average'] });
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'average'] });
    },
  });
};
