import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

export const useOptimizedData = <T>(
  key: string[],
  fetcher: () => Promise<T>,
  options?: {
    staleTime?: number;
    cacheTime?: number;
    enabled?: boolean;
  }
) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: key,
    queryFn: fetcher,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    cacheTime: options?.cacheTime ?? 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    retry: 1
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: key });
  }, [queryClient, key]);

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({ queryKey: key, queryFn: fetcher });
  }, [queryClient, key, fetcher]);

  const optimizedData = useMemo(() => query.data, [query.data]);

  return { ...query, data: optimizedData, invalidate, prefetch };
};