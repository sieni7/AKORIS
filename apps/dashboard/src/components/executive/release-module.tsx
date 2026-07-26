import { useState } from 'react';
import { useAKORIS } from '../../lib/sdk';
import { useCurrentState, useStateMachine, useStateHistory, useTransition } from '@akoris/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { TransitionModal } from '../project/transition-modal';
import { HistoryList } from '../project/history-list';

export function ReleaseModule() {
  const api = useAKORIS();
  const current = useCurrentState(api.client);
  const machine = useStateMachine(api.client);
  const history = useStateHistory(api.client);
  const transition = useTransition(api.client);
  const [selectedTransition, setSelectedTransition] = useState<{ from: string; to: string } | null>(null);

  const handleConfirm = async (from: string, to: string) => {
    const safeTransition = api.withNotifications(
      () => transition.mutateAsync({ from, to }),
      { successMessage: `Transition → ${to} completed`, errorMessage: 'Transition failed. Check state machine rules.' },
    );
    await safeTransition();
    setSelectedTransition(null);
  };

  if (current.isLoading || machine.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const stateMachine = machine.data;
  const currentState = current.data?.currentState;
  const availableTargets = (stateMachine?.transitions as any[])
    ?.filter((t: any) => t.from === currentState)
    .map((t: any) => t.to) ?? [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Release Management</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Current State</CardTitle></CardHeader>
          <CardContent>
            <Badge variant="default" className="text-base px-3 py-1">{currentState ?? '—'}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Machine Version</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{stateMachine?.version ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total States</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{stateMachine?.states?.length ?? 0}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Available Transitions</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableTargets.length === 0 && (
              <p className="text-sm text-muted-foreground">No transitions available from the current state.</p>
            )}
            {availableTargets.map((target: string) => (
              <Button key={target} variant="outline" onClick={() => setSelectedTransition({ from: currentState!, to: target })}>
                {currentState} → {target}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

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
