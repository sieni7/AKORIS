import { useState, useCallback, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/app-shell';
import { HealthModule } from './components/executive/health-module';
import { QualityModule } from './components/executive/quality-module';
import { ReleaseModule } from './components/executive/release-module';
import { StateMachineModule } from './components/project/state-machine-module';
import { LogsViewer } from './components/logs/logs-viewer';
import { useCommandRegistry } from './hooks/useCommandRegistry';
import { Activity, ShieldCheck, Rocket, GitBranch, ScrollText } from 'lucide-react';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 10_000 } },
});

const views: Record<string, React.ReactNode> = {
  health: <HealthModule />,
  quality: <QualityModule />,
  release: <ReleaseModule />,
  'state-machine': <StateMachineModule />,
  logs: <LogsViewer />,
};

const NAV_COMMANDS = [
  { id: 'nav-health', title: 'Health Dashboard', keywords: ['health', 'kpi', 'status'], handler: (_n: (v: string) => void) => () => _n('health'), icon: Activity },
  { id: 'nav-quality', title: 'Quality Dashboard', keywords: ['quality', 'audit', 'coverage'], handler: (_n: (v: string) => void) => () => _n('quality'), icon: ShieldCheck },
  { id: 'nav-release', title: 'Release Dashboard', keywords: ['release', 'deploy', 'production'], handler: (_n: (v: string) => void) => () => _n('release'), icon: Rocket },
  { id: 'nav-state-machine', title: 'State Machine', keywords: ['state', 'transition', 'machine'], handler: (_n: (v: string) => void) => () => _n('state-machine'), icon: GitBranch },
  { id: 'nav-logs', title: 'Live Logs', keywords: ['logs', 'live', 'stream'], handler: (_n: (v: string) => void) => () => _n('logs'), icon: ScrollText },
];

export default function App() {
  const [activeView, setActiveView] = useState('health');
  const handleNavigate = useCallback((view: string) => setActiveView(view), []);
  const registry = useCommandRegistry();

  useEffect(() => {
    for (const cmd of NAV_COMMANDS) {
      const Icon = cmd.icon;
      registry.register({
        id: cmd.id,
        title: cmd.title,
        keywords: cmd.keywords,
        icon: <Icon className="h-4 w-4" />,
        handler: cmd.handler(handleNavigate),
      });
    }
    return () => {
      for (const cmd of NAV_COMMANDS) registry.unregister(cmd.id);
    };
  }, [handleNavigate]);

  return (
    <QueryClientProvider client={qc}>
      <AppShell activeView={activeView} onNavigate={handleNavigate}>
        {views[activeView] ?? <div className="text-muted-foreground">Select a view from the sidebar.</div>}
      </AppShell>
    </QueryClientProvider>
  );
}
