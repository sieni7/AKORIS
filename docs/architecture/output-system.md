# Système de formatage

AKORIS CLI utilise un module centralisé `src/output/format.ts` pour produire des sorties cohérentes, lisibles par des humains et par des machines.

---

## Helpers

| Helper | Description | Exemple |
|--------|-------------|---------|
| `success(message)` | Vert, préfixé par `✓` | `success('Opération réussie.')` |
| `error(message)` | Rouge, préfixé par `✗` | `error('Erreur : fichier introuvable.')` |
| `warn(message)` | Jaune, préfixé par `⚠` | `warn('Dépendance optionnelle manquante.')` |
| `info(message)` | Bleu, préfixé par `ℹ` | `info('Chargement du registry...')` |
| `title(message)` | Vert, format titre | `title('📋 Logs AKORIS')` |
| `header(message)` | Cyan, format sous-titre | `header('Filtres appliqués')` |
| `printJSON(data)` | Sortie JSON formatée | `printJSON({ status: 'ok' })` |
| `shouldOutputJSON(options)` | Détecte la présence de `--json` | `if (shouldOutputJSON(options)) { printJSON(...) }` |

---

## Options globales

Ces options sont disponibles sur toutes les commandes :

| Option | Effet |
|--------|-------|
| `--json` | Sortie JSON structurée (désactive les couleurs, les messages textuels, les spinners) |
| `--verbose` | Affiche des informations supplémentaires (logs internes, chemins, temps) |
| `--quiet` | Supprime les messages informatifs (les erreurs et warnings restent visibles) |
| `--no-color` | Désactive les couleurs ANSI (utile pour les logs, les CI) |
| `--output <file>` | Redirige la sortie vers un fichier (le format est déduit de l'extension) |

---

## Intégration avec Commander

Les options globales sont définies une fois dans `src/index.ts` via `program.option(...)`. Un hook `preAction` les injecte dans le contexte de chaque commande.

```typescript
program.hook('preAction', (thisCommand, actionCommand) => {
  const options = thisCommand.opts();
  setGlobalOptions(options);
});
```

Aucune commande n'appelle directement `console.log`. Toutes les sorties transitent par `format.ts`.

---

## Règles de développement

- **Interdiction** d'utiliser `console.log`, `console.error`, `console.warn` ou `console.info` dans `src/commands/`.
- Utiliser `shouldOutputJSON(options)` avant toute sortie texte.
- Les erreurs critiques utilisent `error()` et `process.exit(1)`.
- Les messages secondaires (chargement, progression) utilisent `info()` et sont désactivés en mode `--quiet`.

---

**Voir aussi** : [ADR-002](../adr/ADR-002-why-json-output.md)
