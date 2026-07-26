---
title: "AKORIS Control Center — WebSocket Contract"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "05-api-contract.md"
  - "06-events.md"
  - "11-sdk.md"
---
# 07 — WebSocket Contract

## 1. Objectif

Ce document définit le contrat WebSocket exposé par `apps/api` pour permettre une communication **temps réel** entre le Core Engine et le Dashboard. Les WebSockets sont utilisés pour les cas où le polling serait inefficace ou trop lent (logs, événements, notifications).

---

## 2. Connexion

- **URL** : `ws://localhost:3000/ws`
- **Protocole** : `ws` (WebSocket standard)
- **Heartbeat** : ping/pong (toutes les 30 secondes).

**Format du message de connexion :**
```json
{
  "type": "subscribe",
  "channels": ["logs", "events", "notifications"],
  "filters": {
    "agent": "CORE-01",
    "level": "info"
  }
}
```

**Réponse de confirmation :**
```json
{
  "type": "subscribed",
  "channels": ["logs", "notifications"],
  "status": "ok"
}
```

---

## 3. Canaux disponibles

| Canal | Description | Payload |
|-------|-------------|---------|
| `/ws/logs` | Streaming des logs en temps réel | LogEntry |
| `/ws/events` | Événements métier (StateChanged, GatePassed, etc.) | Event |
| `/ws/notifications` | Notifications temps réel | Notification |
| `/ws/deploy` | Statut des déploiements | DeploymentStatus |
| `/ws/quality` | Résultats des Quality Gates | GateResult |

---

## 4. Format des messages

Tous les messages WebSocket suivent une structure commune :

```typescript
interface WSMessage {
  type: string;             // "log" | "event" | "notification" | "deploy_status" | "gate_result"
  channel: string;          // "logs" | "events" | "notifications" | "deploy" | "quality"
  timestamp: string;        // ISO 8601 UTC
  payload: Record<string, unknown>;
  metadata?: {
    agentId?: string;
    sessionId?: string;
    version?: string;
  };
}
```

---

## 5. Détail par canal

### 5.1. `/ws/logs`

- **Producteur** : `LogReader.watchLogs()`
- **Filtres** : `agent` (partiel), `since` (date), `lines` (nombre, défaut: 1).
- **Message type** : `"log"`
- **Payload** :
```json
{
  "timestamp": "2026-07-26T14:30:00Z",
  "agentId": "CORE-01",
  "action": "transition",
  "details": "Draft → Planned"
}
```

**Exemple de souscription avec filtres :**
```json
{
  "type": "subscribe",
  "channels": ["logs"],
  "filters": {
    "agent": "CORE",
    "since": "2026-07-26T00:00:00Z"
  }
}
```

### 5.2. `/ws/events`

- **Producteur** : Core Engine (après chaque événement métier).
- **Message type** : `"event"`
- **Payload** : Un événement complet (voir `06-events.md`).

### 5.3. `/ws/notifications`

- **Producteur** : `NotificationService`.
- **Message type** : `"notification"`
- **Payload** :
```json
{
  "id": "notif_123",
  "type": "success",
  "title": "Transition réussie",
  "message": "Le projet est passé en PLANNED.",
  "link": "/project",
  "read": false,
  "timestamp": "2026-07-26T14:30:00Z"
}
```

### 5.4. `/ws/deploy`

- **Producteur** : `DeployEngine`.
- **Message type** : `"deploy_status"`
- **Payload** :
```json
{
  "deploymentId": "dep_123",
  "environment": "staging",
  "version": "1.3.0",
  "status": "running",
  "progress": 45,
  "logs": ["Compilation...", "Tests passent..."],
  "timestamp": "2026-07-26T14:30:00Z"
}
```

### 5.5. `/ws/quality`

- **Producteur** : `QualityEngine`.
- **Message type** : `"gate_result"`
- **Payload** :
```json
{
  "gateId": "QG-004",
  "status": "PASS",
  "score": 0.95,
  "details": "Couverture des tests 98%",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

---

## 6. Gestion des erreurs

| Code | Message | Description |
|------|---------|-------------|
| `WS_001` | `Unknown channel` | Le canal demandé n'existe pas. |
| `WS_002` | `Invalid filters` | Les filtres fournis sont invalides. |
| `WS_003` | `Rate limited` | Trop de messages envoyés. |
| `WS_004` | `Connection closed` | Fermeture normale. |

---

## 7. Reconnexion

Le SDK (et le Dashboard) doivent implémenter une **reconnexion automatique** avec backoff exponentiel (2s, 4s, 8s, 16s, max 30s). Après la reconnexion, une nouvelle souscription est envoyée.

---

## 8. Prochaine étape

La spécification WebSocket permet maintenant de concevoir le SDK (`11-sdk.md`) pour consommer ces canaux de manière transparente dans le Dashboard.
