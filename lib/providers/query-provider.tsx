'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQueryDevtools only on client-side and in development
const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  {
    ssr: false,
  }
);

// Create QueryClient instance with proper configuration
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
        // SSR: Disable refetching on mount for SSR
        refetchOnMount: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// Browser QueryClient (singleton pattern)
// This ensures we only create one QueryClient per browser session
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    // This prevents data sharing between different users and requests
    return makeQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    // This ensures data is shared across all components during the session
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use useState to ensure we only create the client once per component instance
  // This is important for SSR compatibility
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
