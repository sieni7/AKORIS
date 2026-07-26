import { useQuery } from '@tanstack/react-query';
import type { AKORISClient } from '../client';

export function useHealth(client: AKORISClient) {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => client.getHealth(),
    refetchInterval: 30_000,
  });
}
