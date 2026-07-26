# Conventions de code

---

## TypeScript

- Le projet utilise TypeScript en mode strict (`strict: true` dans `tsconfig.json`).
- Les types sont exportés depuis `src/types/index.ts`. Les types propres à un fichier sont déclarés localement.
- Préférer `interface` à `type` pour les objets.
- Utiliser `const` par défaut, `let` quand la réaffectation est nécessaire.
- Éviter `any`. Utiliser `unknown` quand le type n'est pas connu, avec vérification explicite.

## Imports

```typescript
// Modules Node.js
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Bibliothèques externes
import { Command } from 'commander';
import chalk from 'chalk';

// Modules internes (avec extension .js)
import { success, error } from '../output/format.js';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
```

Les imports internes utilisent des chemins relatifs avec l'extension `.js` (conformité ESM).

## Noms de variables et fonctions

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Variables | `camelCase` | `projectRoot`, `entryCount` |
| Fonctions | `camelCase` | `readLogs()`, `setAlias()` |
| Classes | `PascalCase` | `LogReader`, `SearchEngine` |
| Interfaces | `PascalCase` | `SearchResult`, `Aliases` |
| Types | `PascalCase` | `LogFilter` |
| Constantes | `UPPER_SNAKE_CASE` | `ALIASES_FILE`, `CACHE_TTL` |

## Structure d'un fichier

1. Imports (groupés par origine : Node → externes → internes)
2. Types et interfaces
3. Constantes
4. Fonctions / méthodes
5. Export

```typescript
import { ... } from '...';

export interface MaConfig { ... }

const DEFAULT_VALUE = 42;

export function maFonction(): void { ... }
```

## Gestion des erreurs

- Utiliser `throw new Error(...)` dans les services.
- Rattraper dans les commandes avec `try/catch` et afficher avec `error()`.
- Les fonctions qui peuvent échouer retournent un type explicite (`T | null`, `{ success: boolean; error?: string }`).

```typescript
// Service
export function resolveAlias(root: string, name: string): string | null {
  const aliases = readAliases(root);
  return aliases[name] ?? null;
}

// Commande
try {
  const result = resolveAlias(root, name);
  if (!result) { warn('Introuvable'); }
} catch (err) {
  error(`Erreur : ${err.message}`);
  process.exit(1);
}
```

## Commits

Les messages de commit suivent la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>: <description courte>

[corps optionnel]
```

Types autorisés : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

Exemples :
```
feat: ajout de la commande alias (set/list/remove/resolve)
docs: Sprint 1 — README, index, quickstart, cli, faq
fix: correction de la détection du Registry path
refactor: migration des commandes vers format.ts
```

Un commit = une unité logique de changement. Pas de commits géants.

## Tests

- Les fichiers de test sont dans `tests/` avec le suffixe `.test.ts`.
- Utiliser `describe` / `it` / `expect` de Vitest.
- Nommer les tests en français : `it('devrait retourner la liste des agents')`.
- Tester les cas nominaux et les cas d'erreur.
- Ne pas tester les détails d'implémentation, tester le comportement observable.
