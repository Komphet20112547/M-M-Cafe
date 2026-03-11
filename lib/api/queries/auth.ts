import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { AuthResponse, User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'admin';
  adminCode?: string;
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const { data } = await api.post<AuthResponse>('/auth/register', registerData);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

// Get current user
export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await api.get<User>('/auth/me');
      return data;
    },
    enabled: !!token && !user,
    initialData: user || undefined,
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};
