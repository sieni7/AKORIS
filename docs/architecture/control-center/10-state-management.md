---
title: "AKORIS Control Center — State Management"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "02-technical-architecture.md"
  - "09-ui-system.md"
  - "11-sdk.md"
---
# 10 — State Management

## 1. Objectif

Ce document définit la stratégie de gestion d'état pour le Dashboard AKORIS Control Center : séparation entre état serveur, état UI, et état formulaire.

---

## 2. Principes

1. **État serveur (server state)** : données provenant de l'API (registry, state, logs). Gérées par TanStack Query (cache, revalidation, mutation).
2. **État UI (ui state)** : état local du frontend (modale ouverte, filtre actif, page courante). Géré par Zustand.
3. **État formulaire** : gestion des formulaires (Prompt, Secret, Transition). Géré par React Hook Form + Zod.
4. **Communication WebSocket** : événements reçus en temps réel. Les données sont intégrées au cache TanStack Query via un `QueryClient.setQueryData()`.

---

## 3. TanStack Query (Server State)

### 3.1. Configuration

```typescript
// apps/dashboard/src/lib/query-client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,   // 30s
      gcTime: 300_000,     // 5min
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
```

### 3.2. Clés de cache

| Key | Description |
|-----|-------------|
| `['health']` | Health Score |
| `['state', 'current']` | État courant |
| `['state', 'machine']` | Machine à états |
| `['registry', 'agents']` | Liste des agents |
| `['registry', 'agent', id]` | Agent spécifique |
| `['search', query]` | Résultats de recherche |
| `['logs', { lines, agent }]` | Logs |
| `['prompts', 'library']` | Liste des prompts |
| `['secrets']` | Liste des secrets |
| `['deployments']` | Liste des déploiements |

### 3.3. Mutations

```typescript
const transitionMutation = useMutation({
  mutationFn: (data: { from: string; to: string }) =>
    client.transition(data.from, data.to),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['state', 'current'] });
    queryClient.invalidateQueries({ queryKey: ['state', 'history'] });
  },
});
```

---

## 4. Zustand (UI State)

### 4.1. Store principal

```typescript
// apps/dashboard/src/lib/store.ts

import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  currentView: 'executive' | 'project' | 'ai-studio' | 'devops' | 'registry';
  filters: {
    logsAgent?: string;
    logsSince?: string;
  };
  modal: {
    type: 'transition' | 'deploy' | 'confirm' | null;
    data?: Record<string, unknown>;
  };
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  currentView: 'executive',
  filters: {},
  modal: { type: null },
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  setView: (view) => set({ currentView: view }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),
  openModal: (type, data) => set({ modal: { type, data } }),
  closeModal: () => set({ modal: { type: null } }),
}));
```

### 4.2. Usage

```typescript
// Dans un composant
const { commandPaletteOpen, openCommandPalette } = useUIStore();
const queryClient = useQueryClient();

// Ouvrir la Command Palette
<Button onClick={openCommandPalette}>Ctrl+K</Button>
```

---

## 5. WebSocket Integration

```typescript
// apps/dashboard/src/lib/websocket-integration.ts

import { ws } from './sdk';
import { queryClient } from './query-client';

ws.on('event', (event) => {
  // Mettre à jour le cache en fonction du type d'événement
  switch (event.type) {
    case 'StateChanged':
      queryClient.setQueryData(['state', 'current'], event.payload.newState);
      queryClient.invalidateQueries({ queryKey: ['state', 'history'] });
      break;
    case 'GatePassed':
      queryClient.invalidateQueries({ queryKey: ['quality'] });
      break;
    case 'DeploymentFinished':
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
      break;
    default:
      // Invalidation large si non spécifique
      queryClient.invalidateQueries();
  }
});
```

---

## 6. React Hook Form + Zod

```typescript
// apps/dashboard/src/routes/project/TransitionForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const TransitionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  comment: z.string().optional(),
});

export function TransitionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(TransitionSchema),
  });

  const onSubmit = (data) => {
    // Appeler la mutation
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Fields */}
    </form>
  );
}
```

---

## 7. Prochaine étape

Après l'état, le document `13-error-model.md` définit le modèle d'erreur unifié pour tout le système.
