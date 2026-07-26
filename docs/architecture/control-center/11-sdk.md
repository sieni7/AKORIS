---
title: "AKORIS Control Center — SDK Specification"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "04-domain-model.md"
  - "05-api-contract.md"
  - "07-websocket.md"
---
# 11 — SDK Specification

## 1. Objectif

Ce document définit le **SDK TypeScript** (`packages/sdk`) qui permet aux applications (Dashboard, CLI, extensions) de communiquer avec l'API AKORIS de manière **type-safe** et **abstraite**. Le SDK est la **seule interface** que le Dashboard doit utiliser pour interagir avec le Core.

Le SDK expose :
- Un client HTTP pour les appels REST.
- Un client WebSocket pour le temps réel.
- Des hooks React pour simplifier l'intégration dans le Dashboard.
- Une gestion centralisée des erreurs.

---

## 2. Installation

```bash
pnpm add @akoris/sdk
```

---

## 3. Client HTTP (REST)

```typescript
// packages/sdk/src/client.ts

import { z } from 'zod';
import { AgentSchema, StateSchema, LogEntrySchema } from '@akoris/shared';

export class AKORISClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: { baseUrl: string; token?: string }) {
    this.baseUrl = config.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
    };
  }

  // ===== Health =====
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  // ===== State =====
  async getStateMachine(): Promise<StateMachine> {
    return this.request<StateMachine>('/state/machine');
  }

  async getCurrentState(): Promise<State> {
    return this.request<State>('/state/current');
  }

  async getStateHistory(): Promise<TransitionHistory[]> {
    return this.request<TransitionHistory[]>('/state/history');
  }

  async transition(from: string, to: string, comment?: string): Promise<TransitionResult> {
    return this.request<TransitionResult>('/state/transition', {
      method: 'POST',
      body: JSON.stringify({ from, to, comment }),
    });
  }

  // ===== Registry =====
  async getRegistryIndex(): Promise<RegistryIndex> {
    return this.request<RegistryIndex>('/registry/index');
  }

  async listAgents(filters?: { domain?: string; status?: string }): Promise<Agent[]> {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request<Agent[]>(`/registry/agents?${params}`);
  }

  async getAgent(id: string): Promise<Agent> {
    return this.request<Agent>(`/registry/agents/${id}`);
  }

  // ===== Search =====
  async search(query: string, options?: { type?: string; limit?: number }): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query, ...options });
    return this.request<SearchResult[]>(`/search?${params}`);
  }

  // ===== Prompts =====
  async buildPrompt(input: PromptBuildInput): Promise<Prompt> {
    return this.request<Prompt>('/prompts/build', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async executePrompt(prompt: Prompt): Promise<PromptExecution> {
    return this.request<PromptExecution>('/prompts/execute', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
  }

  async listPrompts(): Promise<Prompt[]> {
    return this.request<Prompt[]>('/prompts/library');
  }

  async savePrompt(prompt: Prompt): Promise<void> {
    await this.request('/prompts/library', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
  }

  // ===== Secrets =====
  async listSecrets(): Promise<string[]> {
    return this.request<string[]>('/secrets');
  }

  async setSecret(key: string, value: string, provider: string): Promise<void> {
    await this.request('/secrets', {
      method: 'POST',
      body: JSON.stringify({ key, value, provider }),
    });
  }

  async getSecret(key: string): Promise<string> {
    return this.request<string>(`/secrets/${key}`);
  }

  // ===== Logs =====
  async getLogs(filters?: { lines?: number; agent?: string; since?: string }): Promise<LogEntry[]> {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request<LogEntry[]>(`/logs?${params}`);
  }

  // ===== Doctor =====
  async diagnose(): Promise<DiagnosisReport> {
    return this.request<DiagnosisReport>('/doctor');
  }

  async fix(): Promise<FixReport> {
    return this.request<FixReport>('/doctor/fix', { method: 'POST' });
  }

  // ===== DevOps =====
  async listServices(): Promise<ConnectedService[]> {
    return this.request<ConnectedService[]>('/devops/services');
  }

  async deploy(environment: string, version: string): Promise<Deployment> {
    return this.request<Deployment>('/devops/deploy', {
      method: 'POST',
      body: JSON.stringify({ environment, version }),
    });
  }

  // ===== Notifications =====
  async listNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  // ===== Méthode privée =====
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: this.headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new SDKError(error.errors?.[0] || { code: 'UNKNOWN', message: 'Erreur inconnue' });
    }

    const result = await response.json();
    return result.data;
  }
}

export class SDKError extends Error {
  public code: string;
  public suggestion?: string;

  constructor(error: { code: string; message: string; suggestion?: string }) {
    super(error.message);
    this.name = 'SDKError';
    this.code = error.code;
    this.suggestion = error.suggestion;
  }
}
```

---

## 4. WebSocket Client

```typescript
// packages/sdk/src/websocket.ts

import { EventEmitter } from 'events';

export class WSClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor(private url: string) {
    super();
  }

  connect(channels: string[], filters?: Record<string, unknown>): void {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.send({
        type: 'subscribe',
        channels,
        filters: filters || {},
      });
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.emit('message', message);
        if (message.type === 'log') {
          this.emit('log', message.payload);
        } else if (message.type === 'event') {
          this.emit('event', message.payload);
        } else if (message.type === 'notification') {
          this.emit('notification', message.payload);
        }
      } catch (error) {
        this.emit('error', error);
      }
    };

    this.ws.onclose = () => {
      this.emit('disconnected');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      this.emit('error', error);
    };
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('max_reconnect_attempts');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * 2 ** this.reconnectAttempts, 30000);
    setTimeout(() => {
      this.connect([], {}); // reconnect avec les mêmes canaux
    }, delay);
  }

  private send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

---

## 5. Hooks React

```typescript
// packages/sdk/src/hooks.ts

import { useEffect, useState } from 'react';
import { AKORISClient, WSClient } from './index';

export function useHealth(client: AKORISClient) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getHealth()
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [client]);

  return { health, loading };
}

export function useLogs(client: AKORISClient, ws: WSClient, filters?: { agent?: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Charger les logs statiques
    client.getLogs({ lines: 20, ...filters })
      .then(setLogs)
      .catch(console.error);

    // Écouter les logs en temps réel
    const onLog = (entry: LogEntry) => {
      setLogs((prev) => [entry, ...prev].slice(0, 100));
    };
    ws.on('log', onLog);

    return () => {
      ws.off('log', onLog);
    };
  }, [client, ws, filters]);

  return { logs };
}
```

---

## 6. Usage dans le Dashboard

```typescript
// apps/dashboard/src/lib/sdk.ts

import { AKORISClient, WSClient } from '@akoris/sdk';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const client = new AKORISClient({ baseUrl: API_URL });
export const ws = new WSClient(API_URL.replace('/api/v1', '/ws'));

// Connexion WebSocket
ws.connect(['logs', 'events', 'notifications']);
```

```typescript
// apps/dashboard/src/routes/executive/index.tsx

import { useHealth } from '@akoris/sdk/hooks';
import { client } from '../../lib/sdk';

export default function ExecutiveDashboard() {
  const { health, loading } = useHealth(client);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Health Score: {health?.healthScore}</h1>
      <p>Status: {health?.status}</p>
      <p>Tendance: {health?.trend}</p>
    </div>
  );
}
```

---

## 7. Tests du SDK

Le SDK est testé avec :
- **Vitest** (unitaires, mocks de `fetch` et `WebSocket`).
- **Playwright** (intégration avec l'API réelle).

**Règle** : Toute modification du SDK nécessite une mise à jour des tests.

---

## 8. Prochaine étape

Avec la Phase B (Contrats) maintenant complète, la prochaine étape est la **Phase C** (Implémentation) :

- `08-security.md`
- `09-ui-system.md`
- `10-state-management.md`
- `13-error-model.md`
