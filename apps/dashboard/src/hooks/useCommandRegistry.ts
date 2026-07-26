import { create } from 'zustand';

export interface Command {
  id: string;
  title: string;
  keywords: string[];
  icon?: React.ReactNode;
  handler: () => void;
}

interface CommandRegistryState {
  commands: Command[];
  register: (command: Command) => void;
  unregister: (id: string) => void;
  search: (query: string) => Command[];
}

export const useCommandRegistry = create<CommandRegistryState>((set, get) => ({
  commands: [],
  register: (command) => set((state) => ({ commands: [...state.commands, command] })),
  unregister: (id) => set((state) => ({ commands: state.commands.filter((c) => c.id !== id) })),
  search: (query) => {
    const lower = query.toLowerCase();
    return get().commands.filter(
      (c) => c.title.toLowerCase().includes(lower) || c.keywords.some((k) => k.includes(lower)),
    );
  },
}));
