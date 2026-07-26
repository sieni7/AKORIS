# @akoris/shared

Types, schémas Zod et constantes partagés entre les packages AKORIS (Core, CLI, API, Dashboard, SDK).

## Utilisation

```typescript
import { AgentSchema, DOMAINS, ERROR_CODES } from '@akoris/shared';

// Validation
const agent = AgentSchema.parse(data);

// Constantes
if (agent.domain === DOMAINS.CORE) { ... }
```

## Scripts

- `pnpm build` : compile le package
- `pnpm dev` : mode watch
- `pnpm test` : exécute les tests
- `pnpm lint` : vérifie le code
