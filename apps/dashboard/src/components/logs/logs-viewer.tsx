import { useState, useRef, useEffect } from 'react';
import { useAKORIS } from '../../lib/sdk';
import { useLiveLogs } from '@akoris/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

const WS_BASE = typeof window !== 'undefined' ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws` : '';

const levelColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  debug: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export function LogsViewer() {
  const api = useAKORIS();
  const [levelFilter, setLevelFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const { data: logs, connected, isLoading } = useLiveLogs(
    api.client,
    { lines: 100, level: levelFilter || undefined, agent: agentFilter || undefined },
    WS_BASE,
  );

  const entries = (logs as any[]) ?? [];

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, autoScroll]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Live Logs</h2>
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', connected ? 'bg-green-500' : 'bg-red-500')} />
          <span className="text-xs text-muted-foreground">{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Filter by level (info, warn, error, debug)"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by agent"
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card>
        <CardHeader className="py-3"><CardTitle className="text-sm">Log Stream</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]" ref={scrollRef} onScroll={() => setAutoScroll(false)}>
            {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading logs...</p>}
            {!isLoading && entries.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">No logs match the current filters.</p>
            )}
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Level</th>
                  <th className="px-3 py-2 font-medium">Time</th>
                  <th className="px-3 py-2 font-medium">Agent</th>
                  <th className="px-3 py-2 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry: any) => (
                  <tr key={entry.id} className="border-b hover:bg-muted/50">
                    <td className="px-3 py-1.5"><Badge className={cn('text-[10px] px-1.5 py-0', levelColors[entry.level] ?? '')}>{entry.level}</Badge></td>
                    <td className="px-3 py-1.5 text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                    <td className="px-3 py-1.5 text-xs font-medium">{entry.agent}</td>
                    <td className="px-3 py-1.5 text-xs">{entry.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
