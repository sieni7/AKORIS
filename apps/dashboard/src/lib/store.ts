import { create } from 'zustand';

export interface NotificationEntry {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface UIState {
  theme: 'light' | 'dark';
  commandPaletteOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: NotificationEntry[];
  toggleTheme: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleSidebar: () => void;
  addNotification: (n: Omit<NotificationEntry, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

let notifCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  commandPaletteOpen: false,
  sidebarCollapsed: false,
  notifications: [],

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),

  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { ...n, id: `n-${++notifCounter}`, timestamp: new Date().toISOString() },
        ...state.notifications,
      ].slice(0, 50),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((x) => x.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
