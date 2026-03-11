'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { connectSocket, disconnectSocket } from '@/lib/realtime/client';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    connectSocket(token);
    return () => disconnectSocket();
  }, [token]);

  return <>{children}</>;
}

