---
title: "ADR-003 — Core First : isolation du moteur métier"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
related:
  - "03-core.md"
  - "01-system-architecture.md"
---
# ADR-003 — Core First : isolation du moteur métier

## Contexte

Le CLI AKORIS v1.3.0 mélange logique métier et code d'interface (Commander, output formatting). Cela rend les tests complexes et l'ajout de nouvelles interfaces (Dashboard, API) difficile.

## Décision

Toute la **logique métier** est extraite dans `packages/core`, un package **0 dépendance externe** (Node.js natif uniquement).

### Règles strictes

1. **Aucune dépendance externe** : pas de `commander`, `fastify`, `chalk`, `ora`, etc.
2. **Aucun effet de bord UI** : pas de `console.log`, `process.stdout`, `process.argv`.
3. **Accès filesystem explicite** : les chemins sont injectés en paramètre.
4. **Erreurs typées** : toutes les erreurs du Core utilisent `CoreError` avec un `code`.
5. **Testable sans mock** : les moteurs acceptent leurs dépendances en constructeur.

## Options considérées

1. **Conserver la logique dans le CLI** — rejeté car rend l'API et le Dashboard dépendants de Commander.
2. **Partager la logique via un package utilitaire** — rejeté car trop flou, pas de contrat clair.
3. **Core 0-dependency** — choisi pour la portabilité et la testabilité.

## Conséquences

- Le CLI doit être refactoré pour consommer `@akoris/core` (M4).
- La courbe d'apprentissage est faible (TypeScript natif).
- Le Core peut être testé sans l'API ni le Dashboard.
- Les nouveaux moteurs (quality, metrics) suivront le même modèle.
