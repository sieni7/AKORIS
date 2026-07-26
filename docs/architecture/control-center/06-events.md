---
title: "AKORIS Control Center — Event System"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "03-core.md"
  - "05-api-contract.md"
  - "07-websocket.md"
  - "11-sdk.md"
---

# 06 — Event System

## 1. Objectif

Ce document définit le **système d'événements** d'AKORIS Control Center. Les événements sont le mécanisme central de communication entre le Core, l'API et le Dashboard. Ils permettent la mise à jour temps réel du Dashboard et la traçabilité de toutes les actions.

---

## 2. Principes

- **Event-driven architecture** : toutes les actions importantes produisent un événement.
- **Fire-and-forget** : le Core émet un événement sans attendre de réponse.
- **Typé** : chaque événement a un type, un schéma et un payload définis.
- **Traçable** : chaque événement a un timestamp et un `eventId` unique.
- **Persistant** : les événements sont écrits dans les logs pour relecture différée.

---

## 3. Format d'événement

```typescript
interface AkorisEvent {
  eventId: string;               // UUID v4
  type: string;                  // Namespace:action (e.g. "state:changed")
  timestamp: string;             // ISO 8601
  source: string;                // "core" | "api" | "cli" | "dashboard"
  actor?: string;                // Identifiant de l'acteur humain
  payload: Record<string, unknown>;
  metadata?: {
    correlationId?: string;      // Pour chaîner des événements
    duration?: number;           // Durée de l'opération (ms)
    version?: string;            // Version du système
  };
}
```

---

## 4. Types d'événements

### 4.1. State events

| Type | Description | Payload |
|------|-------------|---------|
| `state:changed` | Transition exécutée | `{ from, to, timestamp, gatesPassed, gatesFailed? }` |
| `state:transition-denied` | Transition refusée | `{ from, to, reason, gatesFailed }` |
| `state:gate-passed` | Quality Gate validé | `{ gateId, transition }` |
| `state:gate-failed` | Quality Gate échoué | `{ gateId, transition, reason }` |
| `state:repaired` | État réparé par doctor | `{ previous, current, repairs }` |

### 4.2. Registry events

| Type | Description | Payload |
|------|-------------|---------|
| `registry:reloaded` | Registry rechargé | `{ agents, rules, capabilities, timestamp }` |
| `registry:agent-updated` | Agent modifié | `{ agentId, changes }` |
| `registry:validation-failed` | Échec de validation du Registry | `{ errors }` |

### 4.3. Search events

| Type | Description | Payload |
|------|-------------|---------|
| `search:completed` | Recherche terminée | `{ query, total, duration }` |
| `search:index-built` | Index reconstruit | `{ sources, duration }` |

### 4.4. Prompt events

| Type | Description | Payload |
|------|-------------|---------|
| `prompt:built` | Prompt construit | `{ agentId, promptId?, duration }` |
| `prompt:executed` | Prompt exécuté sur LLM | `{ agentId, provider, model, duration, tokenUsage }` |
| `prompt:saved` | Prompt sauvegardé | `{ promptId, name, agentId }` |
| `prompt:deleted` | Prompt supprimé | `{ promptId }` |

### 4.5. Log events

| Type | Description | Payload |
|------|-------------|---------|
| `log:entry` | Nouvelle entrée de log | `{ agentId, action, details, level }` |

### 4.6. Doctor events

| Type | Description | Payload |
|------|-------------|---------|
| `doctor:diagnosis-completed` | Diagnostic terminé | `{ status, summary }` |
| `doctor:fix-completed` | Réparation terminée | `{ fixed, failed, fixes }` |

### 4.7. Secret events

| Type | Description | Payload |
|------|-------------|---------|
| `secret:set` | Secret créé/mis à jour | `{ key }` |
| `secret:deleted` | Secret supprimé | `{ key }` |

### 4.8. Alias events

| Type | Description | Payload |
|------|-------------|---------|
| `alias:set` | Alias créé/mis à jour | `{ name, command }` |
| `alias:deleted` | Alias supprimé | `{ name }` |

### 4.9. System events

| Type | Description | Payload |
|------|-------------|---------|
| `system:startup` | API démarrée | `{ version, uptime }` |
| `system:shutdown` | API arrêtée | `{ uptime }` |
| `system:error` | Erreur système | `{ code, message }` |

---

## 5. Exemples d'événements

### Événement de transition

```json
{
  "eventId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "type": "state:changed",
  "timestamp": "2026-07-26T12:00:00Z",
  "source": "core",
  "actor": "user@example.com",
  "payload": {
    "from": "Draft",
    "to": "Planned",
    "timestamp": "2026-07-26T12:00:00Z",
    "gatesPassed": ["QG-01", "QG-02"],
    "gatesFailed": null
  },
  "metadata": {
    "correlationId": "corr-001",
    "duration": 15
  }
}
```

### Événement de log

```json
{
  "eventId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "type": "log:entry",
  "timestamp": "2026-07-26T12:00:01Z",
  "source": "core",
  "payload": {
    "agentId": "CORE-01",
    "action": "transition",
    "details": "Draft → Planned",
    "level": "info"
  }
}
```

---

## 6. Canaux de diffusion

Les événements sont émis via deux canaux :

1. **WebSocket** : diffusion temps réel aux clients connectés (Dashboard, CLI `logs --watch`).
2. **Logs** : persistance dans `.akoris/logs/sessions/` pour relecture différée.

---

## 7. Souscription aux événements

### Serveur → Client (WebSocket)

Les clients souscrivent à des types d'événements spécifiques via WebSocket :

```
WS /ws/v1/events
```

**Message de souscription (client → serveur) :**
```json
{
  "type": "subscribe",
  "channels": ["state:*", "log:*"]
}
```

**Message de désouscription :**
```json
{
  "type": "unsubscribe",
  "channels": ["log:entry"]
}
```

---

## 8. Cohérence avec le Blueprint

- Le système d'événements couvre tous les bounded contexts (`01-system-architecture.md`).
- Les événements sont typés et versionnés (conforme à `03-core.md`).
- La diffusion WebSocket est détaillée dans `07-websocket.md`.
- Le SDK expose des souscripteurs (`11-sdk.md`).

---

## Statut

- `06-events.md` : 🔍 **Draft**

**Prochaine action** : Validez ce document pour passer au protocole WebSocket.
