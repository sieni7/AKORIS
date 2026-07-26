# @akoris/core

Moteur central AKORIS — logique métier indépendante de toute interface.

0 dépendance externe. Utilise uniquement Node.js natif (`fs/promises`, `crypto`, `path`).

## Services

| Service | Fichier | Description |
|---|---|---|
| RegistryReader | `registry/registry-reader.ts` | Lecture et validation du Registry |
| StateMachineEngine | `state/state-machine.ts` | Machine à états et transitions |
| SearchEngine | `search/search-engine.ts` | Recherche dans le Registry |
| LogReader | `logs/log-reader.ts` | Lecture des logs |
| AliasManager | `alias/alias-manager.ts` | CRUD des alias de commandes |
| DoctorEngine | `doctor/doctor-engine.ts` | Diagnostic et réparation du projet |
| SecretManager | `secrets/secret-manager.ts` | Chiffrement AES-256-GCM des secrets |

## Utilisation

```typescript
import { RegistryReader, StateMachineEngine } from '@akoris/core';

const reader = new RegistryReader('/chemin/du/projet');
const index = await reader.loadIndex();
const agents = await reader.listAgents({ domain: 'CORE' });

const engine = new StateMachineEngine('/chemin/du/projet');
const state = await engine.getCurrentState();
```

## Principes

- 0 dépendance externe (sauf `@akoris/shared` pour les types)
- `fs/promises` exclusivement
- Validation native (pas de Zod)
- Toutes les erreurs sont des `Error` natives
