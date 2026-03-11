'use client';

import { QueryProvider } from '@/lib/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { RealtimeProvider } from '@/components/providers/realtime-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <RealtimeProvider>{children}</RealtimeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
