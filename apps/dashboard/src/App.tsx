import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/app-shell';
import { HealthModule } from './components/executive/health-module';
import { QualityModule } from './components/executive/quality-module';
import { ReleaseModule } from './components/executive/release-module';
import { StateMachineModule } from './components/project/state-machine-module';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 10_000 } },
});

const views: Record<string, React.ReactNode> = {
  health: <HealthModule />,
  quality: <QualityModule />,
  release: <ReleaseModule />,
  'state-machine': <StateMachineModule />,
};

export default function App() {
  const [activeView, setActiveView] = useState('health');
  const handleNavigate = useCallback((view: string) => setActiveView(view), []);

  return (
    <QueryClientProvider client={qc}>
      <AppShell activeView={activeView} onNavigate={handleNavigate}>
        {views[activeView] ?? <div className="text-muted-foreground">Select a view from the sidebar.</div>}
      </AppShell>
    </QueryClientProvider>
  );
}
