import { io, type Socket } from 'socket.io-client';
import type { RealtimeEvents } from '@/lib/realtime/events';

type ClientToServerEvents = Record<string, never>;
type ServerToClientEvents = {
  [K in keyof RealtimeEvents]: (payload: RealtimeEvents[K]) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket() {
  return socket;
}

export function connectSocket(token?: string | null) {
  if (socket?.connected) return socket;

  socket = io({
    path: '/socket.io',
    transports: ['websocket'],
    autoConnect: true,
    auth: token ? { token } : undefined,
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}

