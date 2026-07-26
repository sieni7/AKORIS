import { useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { CommandPalette } from './command-palette';
import { Toaster } from '../ui/toaster';
import { useUIStore } from '../../lib/store';

interface AppShellProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

export function AppShell({ children, activeView, onNavigate }: AppShellProps) {
  const { theme, openCommandPalette, closeCommandPalette } = useUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (useUIStore.getState().commandPaletteOpen) closeCommandPalette();
        else openCommandPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openCommandPalette, closeCommandPalette]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={activeView} onNavigate={onNavigate} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <CommandPalette onNavigate={onNavigate} />
      <Toaster />
    </div>
  );
}
