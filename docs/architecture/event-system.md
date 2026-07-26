# Unified Event System — Architecture

**version** : 0.1 (brouillon)
**status** : Proposition
**date** : 2026-07-26
**owner** : AKORIS Core Team
**dépend_de** : Milestone 2 (Control Center MVP)

---

## 1. Contexte

Le Control Center (Dashboard) consomme les données du Core via polling REST ou WebSocket dédié (logs). Plusieurs limitations apparaissent :

- **Polling HTTP** : `GET /health`, `GET /doctor` sont appelés toutes les 30s — pas de réactivité temps réel.
- **WebSocket ad-hoc** : `/ws/logs` est câblé spécifiquement à `LogReader.onLog()` — pas généralisable.
- **Pas d'événements métier** : une transition d'état ou un fix doctor ne déclenche aucun événement.
- **CLI `watch` impossible** : sans événements, `akoris logs watch` et `akoris state watch` ne peuvent pas exister sans polling.

### Objectifs

- Unifier la publication d'événements dans le Core
- Permettre au CLI, Dashboard et API de consommer les mêmes événements
- Remplacer le polling REST par des push WebSocket
- Permettre les commandes CLI `watch` (logs, state, doctor)

---

## 2. Architecture

```
┌──────────────┐     emit()     ┌───────────────┐
│  Engine      │ ─────────────→  │  EventBus     │
│  (StateMachine, │              │  (typé, synchrone) │
│   Doctor,    │              └───────┬───────┘
│   LogReader) │                      │
└──────────────┘                      │ on('event', handler)
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
            ┌──────────┐      ┌──────────┐      ┌──────────┐
            │ CLI      │      │ API      │      │ Tests    │
            │ (watch)  │      │ (WebSocket)     │ (mock)   │
            └──────────┘      └──────────┘      └──────────┘
```

### Flux

1. Un Engine (`StateMachine.transition()`, `LogReader.append()`, `DoctorEngine.fix()`) appelle `eventBus.emit(event)`.
2. L'EventBus distribue l'événement à tous les abonnés synchrones.
3. L'API WebSocket sert de pont vers le Dashboard (abonné à l'EventBus côté serveur, push via WS côté client).
4. Le CLI `watch` s'abonne directement à l'EventBus (même processus Node.js).

---

## 3. Contrat EventBus

```typescript
// packages/core/src/events.ts

type AkorisEvent =
  | StateTransitionEvent
  | LogEntryEvent
  | DoctorFixEvent
  | GateEvaluatedEvent;

interface StateTransitionEvent {
  type: 'state:transition';
  from: string;
  to: string;
  authorizedBy: string;
  timestamp: string;
  gatesStatus: GateStatus[];
}

interface LogEntryEvent {
  type: 'log:entry';
  entry: LogEntry;
}

interface DoctorFixEvent {
  type: 'doctor:fix';
  issueIds: string[];
  result: { fixed: string[]; failed: string[] };
  timestamp: string;
}

interface GateEvaluatedEvent {
  type: 'gate:evaluated';
  gateId: string;
  status: 'PASS' | 'FAIL';
  details?: string;
  timestamp: string;
}

class EventBus {
  /** S'abonner à un type d'événement. Retourne une fonction de désabonnement. */
  on(type: AkorisEvent['type'], handler: (event: AkorisEvent) => void): () => void;

  /** Publier un événement. Tous les handlers synchrones sont appelés. */
  emit(event: AkorisEvent): void;
}
```

---

## 4. Engines impactés

| Engine | Méthode | Événement émis |
|--------|---------|---------------|
| `StateMachineEngine.transition()` | Fin de transition | `state:transition` |
| `LogReader.append()` | Nouvelle entrée | `log:entry` |
| `DoctorEngine.fix()` | Fix exécuté | `doctor:fix` |
| `QualityGateEngine.evaluate()` | Gate évalué | `gate:evaluated` |

Chaque engine reçoit l'EventBus par injection (constructeur). Signature modifiée :

```typescript
// Avant
constructor(machine: StateMachine, initialStateId?: string, gateEngine?: QualityGateEngine)

// Après
constructor(machine: StateMachine, eventBus?: EventBus, initialStateId?: string, gateEngine?: QualityGateEngine)
```

L'EventBus est optionnel pour préserver la compatibilité avec les usages qui n'en ont pas besoin.

---

## 5. Consommateurs

### 5.1 API WebSocket

```
apps/api/src/plugins/websocket.ts (existant)
  → s'abonne à l'EventBus côté serveur
  → push les événements à tous les clients WS connectés
  → remplace le polling REST pour les données temps réel
```

### 5.2 CLI watch

```
packages/cli/src/commands/logs/watch.ts
  → crée un CoreService avec EventBus
  → s'abonne à eventBus.on('log:entry', handler)
  → handler appelle renderer.timeline() pour chaque entrée
```

### 5.3 Dashboard

```
apps/dashboard/src/hooks/useLiveLogs.ts (existant)
  → le WebSocket existant continue de fonctionner
  → peut être étendu pour écouter d'autres événements (state:transition, doctor:fix)
```

---

## 6. Non-périmètre (v0.1)

- Pas de persistance des événements (pas d'Event Store)
- Pas de replay historique
- Pas de filtrage avancé (wildcard, regex)
- Pas de garantie de delivery (synchrone)
- Pas de clustering / multi-process

---

## 7. Roadmap

| Phase | Description | Dépendance |
|-------|-------------|------------|
| **E.1** | Créer `EventBus` + types dans `@akoris/core` | Aucune |
| **E.2** | Instrumenter `StateMachineEngine` | E.1 |
| **E.3** | Instrumenter `LogReader` + `DoctorEngine` | E.1 |
| **E.4** | Instrumenter `QualityGateEngine` | E.1 |
| **E.5** | API WebSocket : abonnement EventBus → push WS | E.2-E.4 |
| **E.6** | CLI : `akoris logs watch` + `akoris state watch` | E.2-E.3 + CLI Refactor Phase 3 |
| **E.7** | Dashboard : live events via WebSocket enrichi | E.5 |

---

**Document lié** : `docs/roadmap/cli-refactor.md` (v2.0) — le CLI `watch` consommera cet EventBus.
