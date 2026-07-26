---
title: "AKORIS Control Center — WebSocket Protocol"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "05-api-contract.md"
  - "06-events.md"
  - "11-sdk.md"
  - "ADR-004-fastify.md"
---

# 07 — WebSocket Protocol

## 1. Objectif

Ce document définit le **protocole WebSocket** d'AKORIS Control Center. Les WebSockets sont utilisés pour la diffusion en temps réel d'événements et de logs vers le Dashboard, le CLI et le SDK.

---

## 2. Principes

- **Uniquement serveur → client** pour les événements (pas de RPC via WebSocket).
- **Connexion persistante** avec reconnexion automatique côté client.
- **Canaux logiques** pour filtrer les événements côté client.
- **Format JSON** pour tous les messages.
- **Basé sur `@fastify/websocket`** (intégré à Fastify).

---

## 3. Connexion

### Endpoints WebSocket

| Endpoint | Description |
|----------|-------------|
| `WS /ws/v1/events` | Événements système (state, registry, prompts, etc.) |
| `WS /ws/v1/logs` | Streaming des logs en temps réel |

### Exemple de connexion

```javascript
// SDK
const ws = new WebSocket('ws://localhost:3001/ws/v1/events');
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
};
```

---

## 4. Messages

### 4.1. Format des messages serveur → client

```json
{
  "type": "event",
  "channel": "state:changed",
  "data": { ... },
  "timestamp": "2026-07-26T12:00:00Z"
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `type` | string | Toujours `"event"` pour un événement |
| `channel` | string | Type d'événement (cf. `06-events.md`) |
| `data` | object | Payload de l'événement |
| `timestamp` | string | ISO 8601 |

### 4.2. Contrôle de flux

Le serveur peut envoyer des messages de contrôle :

```json
{
  "type": "heartbeat",
  "timestamp": "2026-07-26T12:00:00Z"
}
```

```json
{
  "type": "error",
  "code": "RATE_LIMITED",
  "message": "Too many subscriptions"
}
```

---

## 5. Souscription aux canaux

Les clients peuvent souscrire à des canaux spécifiques pour filtrer les événements.

### Souscrire

```json
{
  "type": "subscribe",
  "channels": ["state:*", "log:*"]
}
```

### Désouscrire

```json
{
  "type": "unsubscribe",
  "channels": ["log:entry"]
}
```

### Liste des canaux disponibles

| Canal | Événements | Endpoint WS |
|-------|------------|-------------|
| `state:*` | Tous les événements d'état | `/ws/v1/events` |
| `state:changed` | Transition réussie | `/ws/v1/events` |
| `state:transition-denied` | Transition refusée | `/ws/v1/events` |
| `state:gate-passed` | QG validé | `/ws/v1/events` |
| `state:gate-failed` | QG échoué | `/ws/v1/events` |
| `registry:*` | Tous les événements Registry | `/ws/v1/events` |
| `registry:reloaded` | Registry rechargé | `/ws/v1/events` |
| `search:*` | Tous les événements Search | `/ws/v1/events` |
| `search:completed` | Recherche terminée | `/ws/v1/events` |
| `prompt:*` | Tous les événements Prompt | `/ws/v1/events` |
| `prompt:executed` | Prompt exécuté | `/ws/v1/events` |
| `doctor:*` | Tous les événements Doctor | `/ws/v1/events` |
| `secret:*` | Tous les événements Secret | `/ws/v1/events` |
| `alias:*` | Tous les événements Alias | `/ws/v1/events` |
| `system:*` | Tous les événements système | `/ws/v1/events` |
| `log:*` | Tous les logs | `/ws/v1/logs` |
| `log:entry` | Nouvelle ligne de log | `/ws/v1/logs` |

**Note :** `channel` supporte les wildcards (`*`). `state:*` souscrit à tous les événements commençant par `state:`.

---

## 6. Reconnexion

Les clients doivent implémenter une reconnexion automatique :

```javascript
// SDK - reconnect strategy
const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000];

function connectWithReconnect() {
  const ws = new WebSocket('ws://localhost:3001/ws/v1/events');

  ws.onclose = (event) => {
    if (!event.wasClean) {
      const delay = RECONNECT_DELAYS[Math.min(attempt, RECONNECT_DELAYS.length - 1)];
      setTimeout(connectWithReconnect, delay);
      attempt++;
    }
  };
}
```

---

## 7. Logs streaming

Le endpoint `WS /ws/v1/logs` diffuse chaque nouvelle entrée de log en temps réel :

```json
{
  "type": "event",
  "channel": "log:entry",
  "data": {
    "timestamp": "2026-07-26T12:00:01Z",
    "agentId": "CORE-01",
    "action": "transition",
    "details": "Draft → Planned",
    "level": "info",
    "metadata": {
      "from": "Draft",
      "to": "Planned"
    }
  },
  "timestamp": "2026-07-26T12:00:01Z"
}
```

---

## 8. Gestion des erreurs

| Situation | Comportement |
|-----------|--------------|
| Connexion perdue | Le client tente la reconnexion (backoff exponentiel) |
| Canal invalide | Le serveur ignore la souscription et envoie une erreur |
| Trop de souscriptions | Le serveur rejette la souscription (rate limit) |
| Payload invalide | Le serveur ferme la connexion avec code 1003 |

---

## 9. Cohérence avec le Blueprint

- WebSocket utilisé uniquement pour le temps réel (logs, événements), pas pour les RPC (conforme à `05-api-contract.md`).
- Les canaux correspondent aux types d'événements de `06-events.md`.
- Le SDK encapsule la reconnexion (`11-sdk.md`).

---

## Statut

- `07-websocket.md` : 🔍 **Draft**

**Prochaine action** : Validez ce document pour passer au SDK.
