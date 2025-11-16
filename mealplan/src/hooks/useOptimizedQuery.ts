import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

interface UseOptimizedQueryProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
}

export const useOptimizedQuery = <T>({
  queryKey,
  queryFn,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 10 * 60 * 1000, // 10 minutes
  enabled = true
}: UseOptimizedQueryProps<T>) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn,
    staleTime,
    cacheTime,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2
  });

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const prefetchQuery = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime
    });
  }, [queryClient, queryKey, queryFn, staleTime]);

  const optimizedData = useMemo(() => {
    if (!query.data) return null;
    
    // Add any data transformation/optimization here
    return query.data;
  }, [query.data]);

  return {
    ...query,
    data: optimizedData,
    invalidateQuery,
    prefetchQuery
  };
};