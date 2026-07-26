import { useState } from 'react';
import { useAKORIS } from '../../lib/sdk';
import { useAgentList } from '@akoris/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import { AgentDetailCard } from './AgentDetailCard';
import { Search } from 'lucide-react';

export function AgentExplorer() {
  const api = useAKORIS();
  const { data, isLoading } = useAgentList(api.client);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [detailAgentId, setDetailAgentId] = useState<string | null>(null);

  const agents = ((data as any)?.agents ?? []) as any[];

  const filtered = searchQuery.trim()
    ? agents.filter((a: any) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.tags ?? []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : agents;

  const domains = [...new Set(filtered.map((a: any) => a.domain))].sort();

  const currentAgentId = detailAgentId ?? selectedAgentId;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Registry Explorer</h2>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agents by name, domain, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="py-3"><CardTitle className="text-sm">Agents ({filtered.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="mx-3 my-2 h-8" />)}
                {!isLoading && filtered.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground">No agents match the current search.</p>
                )}
                {domains.map((domain) => {
                  const domainAgents = filtered.filter((a: any) => a.domain === domain);
                  return (
                    <div key={domain}>
                      <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{domain}</p>
                      {domainAgents.map((a: any) => (
                        <button
                          key={a.id}
                          className={cn(
                            'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left border-l-2',
                            currentAgentId === a.id ? 'border-primary bg-accent/50' : 'border-transparent',
                          )}
                          onClick={() => setSelectedAgentId(a.id)}
                        >
                          <span className={cn('h-2 w-2 rounded-full shrink-0', a.status === 'active' ? 'bg-green-500' : a.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-400')} />
                          <span className="truncate font-medium">{a.name}</span>
                          <Badge variant="outline" className="ml-auto text-[10px] shrink-0">{a.domain}</Badge>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {currentAgentId ? (
            <AgentDetailCard agentId={currentAgentId} onNavigate={setDetailAgentId} />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Select an agent to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
