import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';
import type { Pet, PetSchedule } from '@/types';

// Helper: แปลง Date เป็น string รูปแบบ YYYY-MM-DD ตามเวลาไทย (Asia/Bangkok)
const toThailandDateString = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
};

// Get all pets
export const usePets = () => {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const { data } = await api.get<Pet[]>('/pets');
      return data;
    },
  });
};

// Get single pet
export const usePet = (id: string) => {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: async () => {
      const { data } = await api.get<Pet>(`/pets/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Get pet by QR code
export const usePetByQR = (qrCode: string) => {
  return useQuery({
    queryKey: ['pets', 'qr', qrCode],
    queryFn: async () => {
      const { data } = await api.get<Pet>(`/pets/qr/${qrCode}`);
      return data;
    },
    enabled: !!qrCode,
  });
};

// Get pet schedule
export const usePetSchedule = (petId: string, date?: string) => {
  const today = date || toThailandDateString(new Date());

  return useQuery({
    queryKey: ['pets', petId, 'schedule', today],
    queryFn: async () => {
      const { data } = await api.get<PetSchedule>(`/pets/${petId}/schedule`, {
        params: { date: today },
      });
      return data;
    },
    enabled: !!petId,
  });
};

// Get today's schedules for all pets
export const useTodaySchedules = (date?: string) => {
  const today = date || toThailandDateString(new Date());

  return useQuery({
    queryKey: ['pets', 'schedules', today],
    queryFn: async () => {
      const { data } = await api.get<PetSchedule[]>(`/pets/schedules`, {
        params: { date: today },
      });
      return data;
    },
  });
};

// Get weekly schedules for all pets (Sunday to Saturday)
export const useWeeklySchedules = () => {
  return useQuery({
    queryKey: ['pets', 'schedules', 'weekly'],
    queryFn: async () => {
      try {
        // Get dates for the week (Sunday to Saturday) อิงเวลาไทย
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday (ตามเวลา local ของ browser ซึ่งสำหรับลูกค้าคือไทย)
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - dayOfWeek);
        sunday.setHours(0, 0, 0, 0);

        const weekDates: string[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(sunday);
          date.setDate(sunday.getDate() + i);
          weekDates.push(toThailandDateString(date));
        }

        // Fetch schedules for each day with extra safety soว่าไม่มี Promise ใด reject
        const schedulesPromises = weekDates.map(date =>
          api
            .get<PetSchedule[]>(`/pets/schedules`, {
              params: { date },
            })
            .then((res) => ({ date, schedules: res.data || [] }))
            .catch((error) => {
              console.error(`Error fetching schedule for ${date}:`, error);
              return { date, schedules: [] as PetSchedule[] };
            })
        );

        const results = await Promise.allSettled(schedulesPromises);

        // Group by date (รองรับทั้ง fulfilled / rejected แบบปลอดภัย)
        const weeklyData: Record<string, PetSchedule[]> = {};
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const { date, schedules } = result.value;
            weeklyData[date] = Array.isArray(schedules) ? schedules : [];
          } else {
            const date = weekDates[index];
            console.error(`Weekly schedule request failed for ${date}:`, result.reason);
            weeklyData[date] = [];
          }
        });

        return weeklyData;
      } catch (error) {
        console.error('Error fetching weekly schedules:', error);
        // Return empty object on error
        return {};
      }
    },
    retry: 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Create pet (Admin)
export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation<Pet, unknown, Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'qrCode'>>({
    mutationFn: async (pet) => {
      const { data } = await api.post<Pet>('/pets', pet);
      // data.id มาจาก backend ตรงกับคอลัมน์ pets.id (string/UUID)
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules', 'weekly'], exact: false });
    },
  });
};

// Update pet (Admin)
export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...pet }: Partial<Pet> & { id: string }) => {
      const { data } = await api.put<Pet>(`/pets/${id}`, pet);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', variables.id], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules', 'weekly'], exact: false });
    },
  });
};

// Delete pet (Admin)
export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules', 'weekly'], exact: false });
    },
  });
};

// Create/Update pet schedule (Admin)
export const useUpdatePetSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      petId,
      date,
      timeSlots,
    }: {
      petId: string;
      date: string;
      timeSlots: any[];
    }) => {
      const { data } = await api.post<PetSchedule>(`/pets/${petId}/schedule`, {
        date,
        timeSlots,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data across all pages
      // This ensures data updates immediately in:
      // - Pet detail page
      // - Pets list page (today's schedules)
      // - Weekly schedule page
      // - Homepage weekly schedule
      queryClient.invalidateQueries({ 
        queryKey: ['pets', variables.petId, 'schedule'],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['pets', 'schedules'],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['pets', 'schedules', 'weekly'],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['pets'],
        exact: false 
      });
      
      // Refetch immediately to update UI in realtime
      queryClient.refetchQueries({ 
        queryKey: ['pets', variables.petId, 'schedule'],
        exact: false 
      });
      queryClient.refetchQueries({ 
        queryKey: ['pets', 'schedules'],
        exact: false 
      });
      queryClient.refetchQueries({ 
        queryKey: ['pets', 'schedules', 'weekly'],
        exact: false 
      });
    },
  });
};

// Delete pet schedule (Admin)
export const useDeletePetSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      petId,
      date,
    }: {
      petId: string;
      date: string;
    }) => {
      await api.delete(`/pets/${petId}/schedule?date=${encodeURIComponent(date)}`);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['pets', variables.petId, 'schedule'],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['pets', 'schedules'],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['pets', 'schedules', 'weekly'],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['pets'],
        exact: false 
      });
      
      // Refetch immediately to update UI in realtime
      queryClient.refetchQueries({ 
        queryKey: ['pets', variables.petId, 'schedule'],
        exact: false 
      });
      queryClient.refetchQueries({ 
        queryKey: ['pets', 'schedules'],
        exact: false 
      });
      queryClient.refetchQueries({ 
        queryKey: ['pets', 'schedules', 'weekly'],
        exact: false 
      });
    },
  });
};

// Delete single pet schedule time slot (Admin)
export const useDeletePetScheduleTimeSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, slotId }: { petId: string; slotId: string }) => {
      await api.delete(`/pets/${petId}/schedule?slotId=${encodeURIComponent(slotId)}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets', variables.petId, 'schedule'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets', 'schedules', 'weekly'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['pets'], exact: false });
      queryClient.refetchQueries({ queryKey: ['pets', variables.petId, 'schedule'], exact: false });
    },
  });
};
