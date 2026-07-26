import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AKORISClient } from '../client';

export function useDiagnose(client: AKORISClient) {
  return useQuery({
    queryKey: ['doctor'],
    queryFn: () => client.diagnose(),
  });
}

export function useFix(client: AKORISClient) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (issueIds?: string[]) => client.fix(issueIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor'] }),
  });
}
