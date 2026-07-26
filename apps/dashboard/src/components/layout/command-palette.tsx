import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Search, Activity, ShieldCheck, Rocket, GitBranch } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../lib/store';

const commands = [
  { id: 'health', label: 'Health Dashboard', icon: Activity },
  { id: 'quality', label: 'Quality Dashboard', icon: ShieldCheck },
  { id: 'release', label: 'Release Dashboard', icon: Rocket },
  { id: 'state-machine', label: 'State Machine', icon: GitBranch },
];

interface CommandPaletteProps {
  onNavigate: (view: string) => void;
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const { commandPaletteOpen, closeCommandPalette } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleSelect = useCallback(
    (id: string) => {
      onNavigate(id);
      closeCommandPalette();
      setQuery('');
      setSelectedIndex(0);
    },
    [onNavigate, closeCommandPalette],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filtered[selectedIndex]) { handleSelect(filtered[selectedIndex].id); }
    },
    [filtered, selectedIndex, handleSelect],
  );

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={(v: boolean) => { if (!v) closeCommandPalette(); }}>
      <DialogContent className="top-[15%] sm:max-w-md">
        <DialogHeader><DialogTitle className="sr-only">Command Palette</DialogTitle></DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search views..."
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
            autoFocus
          />
        </div>
        <div className="mt-2 max-h-60 overflow-y-auto">
          {filtered.length === 0 && query && (
            <p className="py-6 text-center text-sm text-muted-foreground">No results found.</p>
          )}
          {filtered.map((cmd, idx) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                className={cn(
                  'flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm',
                  idx === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground',
                )}
                onClick={() => handleSelect(cmd.id)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {cmd.label}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
