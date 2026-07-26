---
title: "AKORIS Control Center — State Management"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "02-technical-architecture.md"
  - "05-api-contract.md"
  - "09-ui-system.md"
  - "11-sdk.md"
---
# 10 — State Management

## 1. Objectif

Ce document définit la **gestion d'état** du Dashboard AKORIS Control Center. Elle suit une architecture en deux couches :

- **TanStack Query** : état serveur (données API, cache, revalidation, mutations).
- **Zustand** : état local (UI, modales, filtres, préférences).

---

## 2. Architecture

```
┌─────────────────────────────────────────────────┐
│                  Composants React                │
├─────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────┐  ┌──────────────┐  │
│  │   TanStack Query        │  │   Zustand    │  │
│  │   (server state)        │  │  (UI state)  │  │
│  │                         │  │              │  │
│  │  - state/current        │  │  - sidebar   │  │
│  │  - registry/agents      │  │  - modale    │  │
│  │  - search?q=...         │  │  - filtres   │  │
│  │  - prompts/library      │  │  - theme     │  │
│  │  - logs?lines=20        │  │  - prefs     │  │
│  └───────────┬─────────────┘  └──────────────┘  │
│              │                                     │
│              ▼                                     │
│  ┌─────────────────────────┐                      │
│  │   SDK (@akoris/sdk)     │                      │
│  │   (client HTTP + WS)    │                      │
│  └───────────┬─────────────┘                      │
│              │                                     │
│              ▼                                     │
│  ┌─────────────────────────┐                      │
│  │   API (Fastify)         │                      │
│  └─────────────────────────┘                      │
└─────────────────────────────────────────────────┘
```

---

## 3. TanStack Query (état serveur)

### 3.1. Query keys

```typescript
// Queries
const queryKeys = {
  health: ['health'],
  state: {
    current: ['state', 'current'],
    machine: ['state', 'machine'],
    history: ['state', 'history'],
  },
  registry: {
    index: ['registry', 'index'],
    agents: (filters?: AgentFilter) => ['registry', 'agents', filters],
    agent: (id: string) => ['registry', 'agents', id],
    rules: ['registry', 'rules'],
    qualityGates: ['registry', 'quality-gates'],
  },
  search: (query: string, options?: SearchOptions) => ['search', query, options],
  prompts: {
    list: ['prompts', 'library'],
    detail: (id: string) => ['prompts', 'library', id],
  },
  logs: (filters?: LogFilter) => ['logs', filters],
  secrets: {
    list: ['secrets'],
    detail: (key: string) => ['secrets', key],
  },
  devops: {
    services: ['devops', 'services'],
    deployments: ['devops', 'deployments'],
  },
  notifications: ['notifications'],
};
```

### 3.2. Hooks de requête

```typescript
// hooks/useState.ts
import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/sdk';

export function useCurrentState() {
  return useQuery({
    queryKey: ['state', 'current'],
    queryFn: () => client.getCurrentState(),
    refetchInterval: 10000,  // Polling toutes les 10s (fallback WebSocket)
  });
}

// hooks/useSearch.ts
import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/sdk';

export function useSearch(query: string, options?: SearchOptions) {
  return useQuery({
    queryKey: ['search', query, options],
    queryFn: () => client.search(query, options),
    enabled: query.length >= 2,  // Déclenché après 2 caractères
    staleTime: 5000,              // Cache 5s
  });
}

// hooks/useAgent.ts
export function useAgent(id: string) {
  return useQuery({
    queryKey: ['registry', 'agents', id],
    queryFn: () => client.getAgent(id),
    enabled: !!id,
  });
}

// hooks/useLogs.ts (initial load)
export function useInitialLogs(filters?: LogFilter) {
  return useQuery({
    queryKey: ['logs', filters],
    queryFn: () => client.getLogs(filters),
    refetchInterval: false,  // En temps réel via WebSocket
  });
}
```

### 3.3. Mutations

```typescript
// hooks/useTransition.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/sdk';

export function useTransition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { from: string; to: string }) =>
      client.transition(data.from, data.to),
    onSuccess: () => {
      // Invalider le cache après une transition réussie
      queryClient.invalidateQueries({ queryKey: ['state', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['state', 'history'] });
    },
  });
}
```

### 3.4. WebSocket mise à jour

```typescript
// lib/websocket-updates.ts
import { useQueryClient } from '@tanstack/react-query';
import { ws } from './sdk';

export function useWebSocketUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onEvent = (event: Event) => {
      switch (event.type) {
        case 'state:changed':
          queryClient.invalidateQueries({ queryKey: ['state'] });
          break;
        case 'registry:reloaded':
          queryClient.invalidateQueries({ queryKey: ['registry'] });
          break;
        case 'secret:updated':
          queryClient.invalidateQueries({ queryKey: ['secrets'] });
          break;
      }
    };

    ws.on('event', onEvent);
    return () => ws.off('event', onEvent);
  }, [queryClient]);
}
```

---

## 4. Zustand (état local)

### 4.1. Store UI

```typescript
// stores/ui-store.ts
import { create } from 'zustand';

interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  commandPaletteOpen: false,
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),

  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

  notifications: [],
  addNotification: (notif) =>
    set((s) => ({ notifications: [notif, ...s.notifications].slice(0, 50) })),
  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
```

### 4.2. Store Filtres

```typescript
// stores/filters-store.ts
import { create } from 'zustand';

interface FiltersStore {
  registryFilter: { domain?: string; status?: string };
  setRegistryFilter: (filter: { domain?: string; status?: string }) => void;

  logFilter: { agent?: string; level?: string };
  setLogFilter: (filter: { agent?: string; level?: string }) => void;

  timelineFilter: { types?: string[]; from?: string; to?: string };
  setTimelineFilter: (filter: { types?: string[]; from?: string; to?: string }) => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  registryFilter: {},
  setRegistryFilter: (filter) => set({ registryFilter: filter }),

  logFilter: {},
  setLogFilter: (filter) => set({ logFilter: filter }),

  timelineFilter: {},
  setTimelineFilter: (filter) => set({ timelineFilter: filter }),
}));
```

---

## 5. Interconnexion TanStack Query + Zustand

| Scénario | TanStack Query | Zustand |
|----------|----------------|---------|
| Charger les agents depuis l'API | ✅ `useQuery` | ❌ |
| Filtrer la liste des agents | ❌ | ✅ `filtersStore` |
| Exécuter une transition | ✅ `useMutation` | ❌ |
| Ouvrir/fermer la modale de transition | ❌ | ✅ `uiStore` |
| Recevoir une notification WebSocket | ✅ invalidation | ✅ `addNotification` |
| Basculer entre thème clair/sombre | ❌ | ✅ `uiStore.theme` |

---

## 6. Prochaine étape

Avec la gestion d'état définie, le document `13-error-model.md` peut spécifier le modèle d'erreurs unifié entre le Core, l'API et le SDK.
