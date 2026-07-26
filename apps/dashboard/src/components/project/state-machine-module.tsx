import { useState } from 'react';
import { useAKORIS } from '../../lib/sdk';
import { useCurrentState, useStateMachine, useStateHistory, useTransition } from '@akoris/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { TransitionModal } from './transition-modal';
import { HistoryList } from './history-list';

interface StateNode { id: string; x: number; y: number }

function buildGraph(states: string[], transitions: { from: string; to: string }[]) {
  const radius = 160;
  const angle = (2 * Math.PI) / states.length;
  const centerX = 300;
  const centerY = 200;
  const nodes = states.map((id, i) => ({
    id,
    x: centerX + radius * Math.cos(angle * i - Math.PI / 2),
    y: centerY + radius * Math.sin(angle * i - Math.PI / 2),
  }));
  return { nodes, edges: transitions.map((t) => ({ from: t.from, to: t.to })) };
}

export function StateMachineModule() {
  const api = useAKORIS();
  const current = useCurrentState(api.client);
  const machine = useStateMachine(api.client);
  const history = useStateHistory(api.client);
  const transition = useTransition(api.client);
  const [selectedTransition, setSelectedTransition] = useState<{ from: string; to: string } | null>(null);

  const handleConfirm = async (from: string, to: string) => {
    const safeTransition = api.withNotifications(
      () => transition.mutateAsync({ from, to }),
      { successMessage: `Transition → ${to} completed`, errorMessage: 'Transition failed.' },
    );
    await safeTransition();
    setSelectedTransition(null);
  };

  if (current.isLoading || machine.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const stateMachine = machine.data;
  const states: string[] = (stateMachine?.states as any[])?.map((s: any) => (typeof s === 'string' ? s : s.id ?? s.name)) ?? [];
  const trans: { from: string; to: string }[] = (stateMachine?.transitions as any[]) ?? [];
  const { nodes, edges } = buildGraph(states, trans);
  const currentStateId = current.data?.currentState;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">State Machine</h2>

      <Card>
        <CardHeader><CardTitle>Visual Graph</CardTitle></CardHeader>
        <CardContent>
          <svg viewBox="0 0 600 400" className="w-full max-w-2xl">
            <defs>
              <marker id="arrowhead" markerWidth={10} markerHeight={7} refX={10} refY={3.5} orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
              </marker>
            </defs>
            {edges.map((e, i) => {
              const from = nodes.find((n) => n.id === e.from);
              const to = nodes.find((n) => n.id === e.to);
              if (!from || !to) return null;
              return (
                <g key={`e-${i}`}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="hsl(var(--border))" strokeWidth={2} markerEnd="url(#arrowhead)" />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>
                    {e.from}→{e.to}
                  </text>
                </g>
              );
            })}
            {nodes.map((node) => {
              const isCurrent = node.id === currentStateId;
              return (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={28}
                    fill={isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--card))'}
                    stroke={isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                    strokeWidth={isCurrent ? 3 : 1.5}
                  />
                  {isCurrent && <circle cx={node.x} cy={node.y} r={34} fill="none" stroke="hsl(var(--primary))" strokeWidth={1} opacity={0.5} />}
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                    fill={isCurrent ? 'white' : 'hsl(var(--foreground))'} fontSize={9} fontWeight={isCurrent ? 'bold' : 'normal'}>
                    {node.id.length > 12 ? node.id.slice(0, 10) + '…' : node.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>States ({states.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {states.map((s) => (
                <Badge key={s} variant={s === currentStateId ? 'default' : 'outline'}
                  className={s !== currentStateId && edges.some((e) => e.from === currentStateId && e.to === s) ? 'cursor-pointer hover:bg-accent' : ''}
                  onClick={() => {
                    if (currentStateId && edges.some((e) => e.from === currentStateId && e.to === s)) {
                      setSelectedTransition({ from: currentStateId, to: s });
                    }
                  }}>
                  {s === currentStateId ? `${s} (current)` : s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Transitions ({edges.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {edges.length === 0 && <p className="text-sm text-muted-foreground">No transitions defined.</p>}
              {edges.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{e.from}</Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="secondary">{e.to}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <HistoryList history={(history.data as any[]) ?? []} />

      <TransitionModal
        open={!!selectedTransition}
        onClose={() => setSelectedTransition(null)}
        onConfirm={handleConfirm}
        transition={selectedTransition}
        isLoading={transition.isPending}
      />
    </div>
  );
}
