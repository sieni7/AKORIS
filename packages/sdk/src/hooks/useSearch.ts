import { useQuery } from '@tanstack/react-query';
import type { AKORISClient, SearchOptions } from '../client';

export function useSearch(client: AKORISClient, q: string | null, options?: SearchOptions) {
  return useQuery({
    queryKey: ['search', q, options],
    queryFn: () => client.search(q!, options),
    enabled: !!q && q.length > 0,
  });
}
