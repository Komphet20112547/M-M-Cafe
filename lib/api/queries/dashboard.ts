import { useQuery } from '@tanstack/react-query';
import api from '../axios';
import type { DashboardStats } from '@/types';

// Get dashboard stats (Admin)
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/dashboard/stats');
      return data;
    },
  });
};
