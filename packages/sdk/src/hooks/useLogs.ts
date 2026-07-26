import { useQuery } from '@tanstack/react-query';
import type { AKORISClient, LogFilter } from '../client';

export function useLogs(client: AKORISClient, filter?: LogFilter) {
  return useQuery({
    queryKey: ['logs', filter],
    queryFn: () => client.getLogs(filter),
    refetchInterval: 5_000,
  });
}
