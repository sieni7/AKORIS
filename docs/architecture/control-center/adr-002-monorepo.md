---
title: "ADR-002 — Monorepo avec pnpm"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
related:
  - "02-technical-architecture.md"
---
# ADR-002 — Monorepo avec pnpm

## Contexte

AKORIS contient plusieurs packages (core, sdk, shared, ui) et applications (cli, api, dashboard). Un outil de monorepo est nécessaire pour gérer les dépendances et les builds.

## Décision

Nous utilisons **pnpm workspaces** comme outil de monorepo.

### Justification

1. **pnpm est déjà utilisé** par le CLI AKORIS.
2. **Plus rapide** que npm et yarn (installation, updates).
3. **Isolation stricte** des dépendances (pas de hoisting sauvage).
4. **Workflows `--filter`** puissants pour les builds sélectifs.
5. **`pnpm-lock.yaml`** fiable et reproductible.

## Options considérées

| Outil | Raison du rejet |
|-------|-----------------|
| **npm workspaces** | Plus lent, moins mature |
| **yarn workspaces** | Pas de différence significative avec pnpm |
| **Turborepo** | Trop lourd pour la taille actuelle |
| **Nx** | Trop opinionated |

## Conséquences

- `pnpm-workspace.yaml` à la racine.
- Scripts racine : `pnpm build`, `pnpm test`, `pnpm lint`.
- Chaque package déclare ses dépendances explicitement.
- Build ordre : `shared → core → api/sdk → dashboard`.
