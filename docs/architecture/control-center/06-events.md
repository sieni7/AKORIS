---
title: "AKORIS Control Center — Events"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "04-domain-model.md"
  - "05-api-contract.md"
  - "07-websocket.md"
---
# 06 — Events

## 1. Objectif

Ce document catalogue l'ensemble des **événements métier** émis par le Core Engine et consommés par les interfaces (Dashboard, CLI, etc.). Les événements sont utilisés pour :

- Mettre à jour l'interface en temps réel (Dashboard).
- Enrichir la Timeline.
- Générer des Notifications.
- Déclencher des actions (Webhooks, automations).

---

## 2. Structure standard d'un événement

```typescript
interface Event {
  id: string;               // UUID
  type: EventType;
  source: string;           // Agent ID ou service (ex: "state-machine")
  timestamp: string;        // ISO 8601 UTC
  payload: Record<string, unknown>;
  version: string;          // SemVer
}
```

---

## 3. Taxonomie des événements

```
Events
├── State
│   ├── StateChanged
│   └── TransitionDenied
├── Registry
│   ├── RegistryReloaded
│   └── AgentUpdated
├── Quality
│   ├── GatePassed
│   └── GateFailed
├── AI Studio
│   ├── PromptExecuted
│   └── PromptSaved
├── DevOps
│   ├── DeploymentStarted
│   ├── DeploymentFinished
│   └── SecretUpdated
├── Observability
│   ├── LogEmitted
│   └── NotificationCreated
└── System
    ├── DoctorCompleted
    └── SearchCompleted
```

---

## 4. Détail des événements

### 4.1. State

#### StateChanged
- **Producteur** : StateMachineEngine (`transition()`).
- **Consommateurs** : Dashboard, Timeline, Notifications.
- **Payload** :
```json
{
  "previousState": "DRAFT",
  "newState": "PLANNED",
  "actor": "GOV-01-Project-Manager",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

#### TransitionDenied
- **Producteur** : StateMachineEngine (`canTransition()`).
- **Consommateurs** : Dashboard, Notifications.
- **Payload** :
```json
{
  "from": "ACTIVE",
  "to": "AUDIT",
  "reason": "Quality Gate QG-004 FAILED",
  "missingGates": ["QG-004", "QG-005"],
  "timestamp": "2026-07-26T14:30:00Z"
}
```

### 4.2. Registry

#### RegistryReloaded
- **Producteur** : RegistryReader (`watch()`).
- **Consommateurs** : Dashboard, SearchEngine.
- **Payload** :
```json
{
  "version": "1.0.0",
  "timestamp": "2026-07-26T14:30:00Z",
  "changes": ["Agent CORE-02 mis à jour", "Règle RULE-042 ajoutée"]
}
```

#### AgentUpdated
- **Producteur** : RegistryReader (`loadAgent()`).
- **Consommateurs** : Dashboard (Registry Explorer).
- **Payload** :
```json
{
  "agentId": "CORE-02-Solution-Architect",
  "version": "1.0.1",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

### 4.3. Quality

#### GatePassed
- **Producteur** : QualityEngine (`evaluateGate()`).
- **Consommateurs** : Dashboard, Notifications.
- **Payload** :
```json
{
  "gateId": "QG-004",
  "score": 0.95,
  "details": "Tous les tests unitaires passent (98%)",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

#### GateFailed
- **Producteur** : QualityEngine (`evaluateGate()`).
- **Consommateurs** : Dashboard, Notifications, StateMachineEngine.
- **Payload** :
```json
{
  "gateId": "QG-005",
  "score": 0.45,
  "details": "Couverture de tests insuffisante (45% vs 80% requis)",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

### 4.4. AI Studio

#### PromptExecuted
- **Producteur** : PromptEngine (`executePrompt()`).
- **Consommateurs** : Dashboard, Prompt Library.
- **Payload** :
```json
{
  "promptId": "123e4567",
  "provider": "openai",
  "tokensUsed": 345,
  "durationMs": 1200,
  "status": "success",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

#### PromptSaved
- **Producteur** : PromptEngine (`savePrompt()`).
- **Consommateurs** : Dashboard, Prompt Library.
- **Payload** :
```json
{
  "promptId": "123e4567",
  "name": "Generate Authentication Component",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

### 4.5. DevOps

#### DeploymentStarted
- **Producteur** : DeployEngine (`deploy()`).
- **Consommateurs** : Dashboard, Notifications.
- **Payload** :
```json
{
  "deploymentId": "dep_123",
  "environment": "staging",
  "version": "1.3.0",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

#### DeploymentFinished
- **Producteur** : DeployEngine (callback).
- **Consommateurs** : Dashboard, Notifications.
- **Payload** :
```json
{
  "deploymentId": "dep_123",
  "status": "success",
  "durationMs": 45000,
  "timestamp": "2026-07-26T14:30:00Z"
}
```

#### SecretUpdated
- **Producteur** : SecretManager (`setSecret()`, `removeSecret()`).
- **Consommateurs** : Dashboard, ConnectedServices.
- **Payload** :
```json
{
  "key": "GITHUB_TOKEN",
  "action": "set",
  "timestamp": "2026-07-26T14:30:00Z"
}
```

### 4.6. Observability

#### LogEmitted
- **Producteur** : LogReader (`watchLogs()`).
- **Consommateurs** : Dashboard (Logs Live), WebSocket.
- **Payload** :
```json
{
  "timestamp": "2026-07-26T14:30:00Z",
  "agentId": "CORE-01",
  "action": "transition",
  "details": "Draft → Planned"
}
```

#### NotificationCreated
- **Producteur** : NotificationService (après événement).
- **Consommateurs** : Dashboard, Notifications.
- **Payload** :
```json
{
  "notificationId": "notif_123",
  "type": "success",
  "title": "Transition réussie",
  "message": "Le projet est passé en PLANNED.",
  "timestamp": "2026-07-26T14:30:00Z",
  "link": "/project"
}
```

### 4.7. System

#### DoctorCompleted
- **Producteur** : DoctorEngine (`fix()`).
- **Consommateurs** : Dashboard, Notifications.
- **Payload** :
```json
{
  "fixed": true,
  "fixes": ["Dossier .akoris/ créé", "manifest.json créé"],
  "timestamp": "2026-07-26T14:30:00Z"
}
```

#### SearchCompleted
- **Producteur** : SearchEngine (`search()`).
- **Consommateurs** : Dashboard.
- **Payload** :
```json
{
  "query": "database",
  "resultCount": 5,
  "timestamp": "2026-07-26T14:30:00Z"
}
```

---

## 5. Canal de diffusion

Les événements sont diffusés via **WebSocket** sur le canal `/ws/events`. Chaque événement est envoyé au format JSON. Le Dashboard écoute ce canal pour mettre à jour l'interface (Timeline, Notifications, etc.).

---

## 6. Prochaine étape

La définition des événements permet maintenant de spécifier le contrat WebSocket (`07-websocket.md`) et de concevoir le SDK (`11-sdk.md`) pour l'écoute de ces événements.
