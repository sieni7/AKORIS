# Guide du développeur

Comment ajouter une commande ou un service au CLI AKORIS.

---

## Ajouter une commande

### 1. Créer le fichier

```bash
touch src/commands/ma-commande.ts
```

### 2. Structure du fichier

```typescript
import { Command } from 'commander';
import { success, error, info, title, printJSON, shouldOutputJSON } from '../output/format.js';

export function maCommandeCommand(): Command {
  return new Command('ma-commande')
    .description('Description de ma commande')
    .argument('<obligatoire>', 'Description')
    .option('--option <value>', 'Description de l\'option')
    .action(async (arg: string, options: { option?: string }) => {
      if (shouldOutputJSON()) {
        printJSON({ result: 'ok' });
        return;
      }
      success('Opération réussie');
    });
}
```

Règles :
- Exporter une fonction qui retourne un `Command` (pas une instance pré-créée)
- Ne pas utiliser `console.log` — passer par les helpers de `format.ts`
- Utiliser `shouldOutputJSON()` avant toute sortie texte

### 3. Enregistrer la commande

Dans `src/index.ts` :

```typescript
import { maCommandeCommand } from './commands/ma-commande.js';

// Avant program.parse()
program.addCommand(maCommandeCommand());
```

### 4. Ajouter la commande au welcome message (optionnel)

```typescript
// Dans la constante WELCOME
akoris ma-commande    Description rapide
```

## Ajouter un service

### 1. Créer le fichier

```bash
touch src/services/mon-service.ts
```

### 2. Structure du service

```typescript
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export class MonService {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath || process.cwd();
  }

  faireQuelque chose(): string[] {
    // Implémentation
  }
}
```

### 3. Utiliser le service dans une commande

```typescript
import { MonService } from '../services/mon-service.js';

// Dans l'action handler
const service = new MonService();
service.faireQuelque chose();
```

## Tests

Les tests sont écrits avec Vitest :

```typescript
import { describe, it, expect } from 'vitest';
import { MonService } from '../services/mon-service.js';

describe('MonService', () => {
  it('devrait retourner un résultat', () => {
    const service = new MonService('/chemin/test');
    expect(service.faireQuelque chose()).toEqual(['a', 'b']);
  });
});
```

Exécution : `npm test` (ou `npx vitest run`).

## Convention de nommage

| Type | Convention | Exemple |
|------|-----------|---------|
| Fichier de commande | `kebab-case.ts` | `ma-commande.ts` |
| Fichier de service | `kebab-case.service.ts` | `mon-service.service.ts` |
| Fonction de commande | `camelCase + Command` | `maCommandeCommand()` |
| Classe de service | `PascalCase` | `MonService` |
| Export | fonction factory | `export function maCommandeCommand()` |
