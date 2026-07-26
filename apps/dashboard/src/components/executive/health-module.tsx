import { useAKORIS } from '../../lib/sdk';
import { useHealth } from '@akoris/sdk';
import { useRegistryIndex, useAgentList } from '@akoris/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

export function HealthModule() {
  const { client: api } = useAKORIS();
  const health = useHealth(api);
  const index = useRegistryIndex(api);
  const agents = useAgentList(api);

  if (health.isLoading || index.isLoading || agents.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-32" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (health.error || index.error) {
    return <div className="text-destructive">Failed to load health data.</div>;
  }

  const h = health.data!;
  const idx = index.data!;
  const agentData = agents.data;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">System Health</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Status</CardTitle></CardHeader>
          <CardContent>
            <Badge variant={h.status === 'ok' ? 'success' : 'destructive'} className="text-sm">
              {h.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Version</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{h.version}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Agents</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{idx.agentCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Domains</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{idx.domains?.length ?? 0}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Agent Registry</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">Last updated: {new Date(idx.lastUpdated).toLocaleString()}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Domain</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Version</th>
                </tr>
              </thead>
              <tbody>
                {agentData?.agents?.map((agent: any) => (
                  <tr key={agent.id} className="border-b last:border-0">
                    <td className="py-2 font-mono text-xs">{agent.id}</td>
                    <td className="py-2">{agent.name ?? agent.id}</td>
                    <td className="py-2"><Badge variant="outline">{agent.domain ?? '—'}</Badge></td>
                    <td className="py-2">
                      <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'error' ? 'destructive' : 'warning'}>
                        {agent.status ?? 'unknown'}
                      </Badge>
                    </td>
                    <td className="py-2">{agent.version ?? '—'}</td>
                  </tr>
                ))}
                {(!agentData?.agents || agentData.agents.length === 0) && (
                  <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">No agents registered.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
