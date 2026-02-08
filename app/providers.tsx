'use client';

import { QueryProvider } from '@/lib/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
