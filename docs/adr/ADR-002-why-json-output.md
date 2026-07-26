# ADR-002 : Sortie JSON centralisée

**Statut :** Approuvé  
**Date :** 2026-07-26  
**Décideur :** AKORIS Core Team  

## Contexte

Chaque commande CLI produisait sa propre sortie texte via `console.log`. Impossible d'intégrer AKORIS dans des pipelines CI/CD ou de consommer les résultats programmatiquement.

## Options envisagées

| Option | Points forts | Points faibles |
|--------|-------------|----------------|
| **Module format.ts centralisé** | Unique point de contrôle, `--json` natif | Nécessite migration de toutes les commandes |
| **Flag --json par commande** | Indépendance | Duplication, incohérence potentielle |
| **Pas de JSON** | Simple | Aucune intégration possible |

## Décision

Création de `src/output/format.ts` avec :

1. **Helpers stylisés** : `success()`, `error()`, `warn()`, `info()`, `title()` — wrappent chalk + symboles
2. **Mode JSON** : `shouldOutputJSON()` + `printJSON()` — désactive la sortie texte quand `--json` est actif
3. **État global** : `setGlobalOptions()` injecté via `preAction` de Commander
4. **Spinner** : `spinner()` basé sur `ora` pour les opérations longues

## Conséquences

- 0 `console.log` dans `src/commands/` et `src/index.ts`
- Mode JSON disponible sur 100% des commandes
- Migration de 15+ commandes réalisée en une session
- Ajout d'une nouvelle commande = import des helpers, pas de réinvention du formatage
- `--quiet` supprime toute sortie non-JSON

## Références

- [chalk](https://github.com/chalk/chalk)
- [ora](https://github.com/sindresorhus/ora)
