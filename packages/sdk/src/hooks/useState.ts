import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AKORISClient, TransitionRequest } from '../client';

export function useStateMachine(client: AKORISClient) {
  return useQuery({
    queryKey: ['state', 'machine'],
    queryFn: () => client.getStateMachine(),
  });
}

export function useCurrentState(client: AKORISClient) {
  return useQuery({
    queryKey: ['state', 'current'],
    queryFn: () => client.getCurrentState(),
  });
}

export function useStateHistory(client: AKORISClient) {
  return useQuery({
    queryKey: ['state', 'history'],
    queryFn: () => client.getStateHistory(),
  });
}

export function useTransition(client: AKORISClient) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: TransitionRequest) => client.transition(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['state'] });
    },
  });
}
