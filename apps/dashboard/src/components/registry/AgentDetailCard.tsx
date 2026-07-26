import { useAKORIS } from '../../lib/sdk';
import { useAgent } from '@akoris/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

const criticityColors: Record<string, string> = {
  critique: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  haute: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  moyenne: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  basse: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  deprecated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  draft: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

interface AgentDetailCardProps {
  agentId: string;
  onNavigate?: (agentId: string) => void;
}

export function AgentDetailCard({ agentId, onNavigate }: AgentDetailCardProps) {
  const api = useAKORIS();
  const { data: agent, isLoading } = useAgent(api.client, agentId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!agent) return <p className="text-sm text-muted-foreground">Agent not found.</p>;

  const a = agent as any;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-lg">{a.name}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">ID</span><p className="font-mono text-xs">{a.id}</p></div>
            <div><span className="text-muted-foreground">Domain</span><p>{a.domain}</p></div>
            <div><span className="text-muted-foreground">Version</span><p>{a.version}</p></div>
            <div><span className="text-muted-foreground">Status</span><p><Badge className={cn('text-[10px]', statusColors[a.status] ?? '')}>{a.status}</Badge></p></div>
            <div><span className="text-muted-foreground">Criticity</span><p><Badge className={cn('text-[10px]', criticityColors[a.criticity] ?? '')}>{a.criticity}</Badge></p></div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{a.description}</p>
          {a.tags && a.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {a.tags.map((t: string) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
            </div>
          )}
        </CardContent>
      </Card>

      {a.capabilities && a.capabilities.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Capabilities</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {a.capabilities.map((cap: any) => (
                <div key={cap.id} className="flex items-start gap-2 text-sm">
                  <Badge className={cn('text-[10px] mt-0.5', cap.type === 'can' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200')}>{cap.type}</Badge>
                  <div><p className="font-medium">{cap.name}</p><p className="text-xs text-muted-foreground">{cap.description}</p></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {a.dependencies && a.dependencies.length > 0 && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Dependencies</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {a.dependencies.map((dep: any) => (
                <button key={dep.agentId} className="flex w-full items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent text-left" onClick={() => onNavigate?.(dep.agentId)}>
                  <Badge className={cn('text-[10px]', dep.type === 'mandatory' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800')}>{dep.type}</Badge>
                  <span className="font-mono text-xs">{dep.agentId}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
