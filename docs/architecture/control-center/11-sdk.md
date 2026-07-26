---
title: "AKORIS Control Center — SDK Client"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "03-core.md"
  - "05-api-contract.md"
  - "06-events.md"
  - "07-websocket.md"
  - "ADR-004-fastify.md"
---

# 11 — SDK Client

## 1. Objectif

Ce document définit le **SDK client TypeScript** pour AKORIS Control Center. Le SDK est la manière privilégiée pour les applications (Dashboard, scripts, intégrations) de consommer l'API Control Center.

---

## 2. Principes

- **0 dépendance** : pas de framework, utilise `fetch` natif (Node 18+ / browser).
- **Type-safe** : tous les types sont importés de `@akoris/shared`.
- **Minimal** : chaque méthode correspond à un endpoint API.
- **WebSocket intégré** : gestion automatique de la reconnexion.
- **Testable** : le client HTTP peut être mocké.

---

## 3. Architecture du SDK

```
packages/sdk/
├── src/
│   ├── index.ts              # Point d'entrée
│   ├── client.ts             # Client HTTP principal
│   ├── types.ts              # Réexport depuis @akoris/shared
│   ├── errors.ts             # Erreurs SDK typées
│   ├── websocket.ts          # Client WebSocket avec reconnexion
│   ├── hooks/                # Hooks React (optionnel)
│   │   ├── useState.ts
│   │   ├── useLogs.ts
│   │   ├── useSearch.ts
│   │   └── usePrompts.ts
│   └── utils.ts              # Utilitaires
```

---

## 4. Client HTTP

### 4.1. Initialisation

```typescript
import { createClient } from '@akoris/sdk';

const client = createClient({
  baseUrl: 'http://localhost:3001',
  timeout: 5000,       // Optionnel, défaut: 10000
});
```

### 4.2. Méthodes disponibles

```typescript
interface AkorisClient {
  // Health
  health(): Promise<HealthResponse>;

  // State
  getState(): Promise<StateResponse>;
  getHistory(options?: PaginationOptions): Promise<HistoryResponse>;
  transition(from: string, to: string, actor?: string): Promise<TransitionResponse>;

  // Registry
  listAgents(filter?: AgentFilter): Promise<AgentListResponse>;
  getAgent(id: string): Promise<AgentResponse>;
  listRules(filter?: RuleFilter): Promise<RuleListResponse>;
  listCapabilities(filter?: CapabilityFilter): Promise<CapabilityListResponse>;
  listQualityGates(): Promise<QualityGateListResponse>;

  // Search
  search(query: string, options?: SearchOptions): Promise<SearchResponse>;

  // Logs
  getLogs(filter?: LogFilter): Promise<LogResponse>;

  // Prompts
  buildPrompt(input: PromptInput): Promise<PromptBuildResponse>;
  testPrompt(prompt: ParsedPrompt, provider: LLMProvider): Promise<PromptTestResponse>;
  savePrompt(data: SavePromptInput): Promise<SavePromptResponse>;
  listPrompts(): Promise<PromptListResponse>;

  // Secrets
  listSecrets(): Promise<SecretListResponse>;
  setSecret(key: string, value: string): Promise<SetSecretResponse>;
  getSecret(key: string): Promise<GetSecretResponse>;
  deleteSecret(key: string): Promise<DeleteSecretResponse>;

  // Aliases
  listAliases(): Promise<AliasListResponse>;
  setAlias(name: string, command: string, description?: string): Promise<SetAliasResponse>;
  deleteAlias(name: string): Promise<DeleteAliasResponse>;

  // Doctor
  diagnose(): Promise<DiagnosisResponse>;
  fix(checks?: string[]): Promise<FixResponse>;

  // WebSocket
  connectEvents(): WebSocketClient;
  connectLogs(): WebSocketClient;
}
```

### 4.3. Exemple d'utilisation

```typescript
import { createClient } from '@akoris/sdk';

const client = createClient({ baseUrl: 'http://localhost:3001' });

// Récupérer l'état
const state = await client.getState();
console.log(`Current state: ${state.data.current}`);

// Exécuter une transition
const result = await client.transition('Draft', 'Planned');
if (result.success) {
  console.log(`Transitioned: ${result.data.from} → ${result.data.to}`);
}

// Rechercher
const search = await client.search('transition Draft');
console.log(`${search.data.total} results`);

// Lire les logs
const logs = await client.getLogs({ lines: 10 });
logs.data.entries.forEach(entry => {
  console.log(`[${entry.level}] ${entry.action}: ${entry.details}`);
});
```

---

## 5. Client WebSocket

```typescript
import { createWebSocketClient } from '@akoris/sdk';

const events = createWebSocketClient('ws://localhost:3001/ws/v1/events');

// Souscrire à des canaux
events.subscribe(['state:*', 'prompt:*']);

// Écouter les événements
events.on('state:changed', (event) => {
  console.log(`State changed: ${event.payload.from} → ${event.payload.to}`);
});

events.on('prompt:executed', (event) => {
  console.log(`LLM call completed in ${event.metadata?.duration}ms`);
});

// Démarrer la connexion (avec reconnexion automatique)
events.connect();

// Arrêter
events.disconnect();
```

### Reconnexion automatique

```typescript
const logs = createWebSocketClient('ws://localhost:3001/ws/v1/logs', {
  reconnect: true,
  maxRetries: 10,
  retryDelay: 1000,       // Délai initial (ms)
  maxRetryDelay: 30000,    // Délai maximum (backoff exponentiel)
});

logs.on('open', () => console.log('Connected'));
logs.on('close', (code) => console.log(`Disconnected: ${code}`));
logs.on('error', (err) => console.error('WS Error:', err));
logs.connect();
```

---

## 6. Hooks React (optionnel)

Le SDK exporte des hooks React pour une intégration directe dans le Dashboard.

### useState

```typescript
import { useState } from '@akoris/sdk/hooks';

function StatePanel() {
  const { data, loading, error } = useState();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Current state: {data?.current}</div>;
}
```

### useLogs (avec WebSocket)

```typescript
import { useLogs } from '@akoris/sdk/hooks';

function LogsPanel() {
  const { entries, isConnected } = useLogs({
    filter: { agents: ['CORE-01'] },
    lines: 50,
  });

  return (
    <div>
      <div>Status: {isConnected ? '🟢' : '🔴'}</div>
      {entries.map((entry, i) => (
        <div key={i}>{entry.timestamp} - {entry.details}</div>
      ))}
    </div>
  );
}
```

### useSearch

```typescript
import { useSearch } from '@akoris/sdk/hooks';

function SearchBar() {
  const { query, setQuery, results, loading } = useSearch();

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <div>Searching...</div>}
      {results.map(r => (
        <div key={r.id}>{r.title} ({r.score})</div>
      ))}
    </div>
  );
}
```

---

## 7. Gestion des erreurs

```typescript
import { ApiError, ConnectionError } from '@akoris/sdk';

try {
  await client.transition('Draft', 'Invalid');
} catch (err) {
  if (err instanceof ApiError) {
    console.error(`API Error: ${err.code} - ${err.message}`);
    console.error(`Suggestion: ${err.suggestion}`);
  } else if (err instanceof ConnectionError) {
    console.error('Connection failed, retrying...');
  }
}
```

---

## 8. Schémas partagés

Tous les types de requête et réponse sont importés de `@akoris/shared` :

```typescript
import type {
  Agent, Rule, Capability, Deliverable, QualityGate,
  ProjectState, TransitionRecord, TransitionResult,
  LogEntry, Prompt, ParsedPrompt, LLMResponse, LLMProvider,
  Alias, Secret, SearchResult, SearchOptions,
  DiagnosisReport, FixReport,
  AkorisEvent,
} from '@akoris/shared';
```

---

## 9. Cohérence avec le Blueprint

- Le SDK encapsule l'API REST (`05-api-contract.md`) et WebSocket (`07-websocket.md`).
- Les types sont partagés via `@akoris/shared` (DRY).
- Les hooks React s'intègrent directement au Dashboard (`02-technical-architecture.md`).
- La gestion d'erreur est cohérente avec le modèle d'erreur du Core (`03-core.md`).

---

## Statut

- `11-sdk.md` : 🔍 **Draft**

**Prochaine action** : Validez ce document pour finaliser la Phase B.
