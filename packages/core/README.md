# @akoris/core

AKORIS Core Engine — logique de gouvernance pure, 0 dépendance runtime.

## Principes

- **Pure Logic, Zero I/O** — Aucune I/O directe ; ports injectés contrôlés par la couche runtime
- **No Hidden Global State** — Aucun état global ou singleton implicite
- **Extensible via Composition** — Injection de dépendances
- **Testabilité Totale** — 100% unit testable
- **Invariants de gouvernance** — Atomicité, snapshot = source de vérité, frontière des secrets

## Installation

```bash
pnpm add @akoris/core
```

## Usage

```typescript
import { createCore } from '@akoris/core';
import { FileSystemStore } from '@akoris/io';

const core = createCore({
  store: new FileSystemStore('/mon-projet'),
  masterKey: process.env.AKORIS_MASTER_KEY
});

// Lire les agents
const agents = core.registry.listAgents();

// Exécuter une transition (atomique, persistée par snapshot)
const outcome = await core.stateMachine.transition({
  from: 'PROPOSITION',
  to: 'DRAFT',
  authorizedBy: { actorId: 'EXP-01', actorType: 'artificial', roles: ['VALIDATOR'] },
  comment: 'Démarrage du projet'
});

if (outcome.status === 'committed') { /* transition réussie */ }

// Persister l'état
await core.persist();
```

## Documentation

- [CORE ENGINE SPECIFICATION](../../docs/specifications/CORE-ENGINE-SPECIFICATION.md)
- [IMPLEMENTATION PLAN](../../docs/specifications/CORE-ENGINE-IMPLEMENTATION-PLAN.md)

## Licence

MIT © AKORIS Core Team