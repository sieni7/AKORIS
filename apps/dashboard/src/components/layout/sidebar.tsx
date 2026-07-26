import { cn } from '../../lib/utils';
import { useUIStore } from '../../lib/store';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { LayoutDashboard, GitBranch, Activity, ShieldCheck, Rocket, ScrollText, Cable } from 'lucide-react';

const sections: { label: string; items: { id: string; label: string; icon: React.ReactNode }[] }[] = [
  {
    label: 'Executive',
    items: [
      { id: 'health', label: 'Health', icon: <Activity className="h-4 w-4" /> },
      { id: 'quality', label: 'Quality', icon: <ShieldCheck className="h-4 w-4" /> },
      { id: 'release', label: 'Release', icon: <Rocket className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Project',
    items: [
      { id: 'state-machine', label: 'State Machine', icon: <GitBranch className="h-4 w-4" /> },
      { id: 'registry', label: 'Registry', icon: <Cable className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Monitor',
    items: [
      { id: 'logs', label: 'Logs', icon: <ScrollText className="h-4 w-4" /> },
    ],
  },
];

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <aside className={cn('flex flex-col border-r bg-card transition-all duration-200', sidebarCollapsed ? 'w-14' : 'w-56')}>
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <LayoutDashboard className="h-5 w-5 shrink-0 text-primary" />
        {!sidebarCollapsed && <span className="text-sm font-semibold">AKORIS</span>}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {sections.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? 'secondary' : 'ghost'}
                  size={sidebarCollapsed ? 'icon' : 'sm'}
                  className={cn('w-full justify-start', sidebarCollapsed ? 'h-9 w-10' : 'px-2')}
                  onClick={() => onNavigate(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span className="ml-2 text-sm">{item.label}</span>}
                </Button>
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
