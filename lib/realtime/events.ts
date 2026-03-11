import type { Order } from '@/types';

export type RealtimeEvents = {
  'order:created': { order: Order };
  'order:updated': { order: Order };
};

