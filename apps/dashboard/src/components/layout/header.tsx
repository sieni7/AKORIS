import { Search, PanelLeftClose, PanelLeft, Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../lib/store';
import { Button } from '../ui/button';

export function Header() {
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme, openCommandPalette } = useUIStore();

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-card px-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </Button>

      <div className="flex-1" />

      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={openCommandPalette}>
        <Search className="h-4 w-4" />
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium">Ctrl+K</kbd>
      </Button>

      <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>
  );
}
