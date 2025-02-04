'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function AppQueryClient({children}: { children: React.ReactNode; }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // cache for 2 minutes
        gcTime: 1000 * 10, // garbage collect every 10 seconds
      }
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}