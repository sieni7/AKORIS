import { useQuery } from '@tanstack/react-query';
import type { AKORISClient, AgentFilter } from '../client';

export function useRegistryIndex(client: AKORISClient) {
  return useQuery({
    queryKey: ['registry', 'index'],
    queryFn: () => client.getRegistryIndex(),
  });
}

export function useAgentList(client: AKORISClient, filter?: AgentFilter) {
  return useQuery({
    queryKey: ['registry', 'agents', filter],
    queryFn: () => client.listAgents(filter),
  });
}

export function useAgent(client: AKORISClient, id: string) {
  return useQuery({
    queryKey: ['registry', 'agents', id],
    queryFn: () => client.getAgent(id),
    enabled: !!id,
  });
}
