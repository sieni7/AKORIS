---
title: "ADR-002 — Monorepo (pnpm workspaces)"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
---
# ADR-002 : Monorepo (pnpm workspaces)

**Contexte** : Le projet AKORIS grandit : CLI, API, Dashboard, SDK, Core. Chaque élément a ses propres dépendances et son propre cycle de vie.

**Décision** : Utiliser un monorepo avec pnpm workspaces pour gérer l'ensemble des packages.

**Alternatives** : Multi-repo (Git submodules) ou utilisation de Lerna/Nx.

**Justification** : pnpm est rapide, léger, et permet de partager les dépendances efficacement. Le monorepo facilite les refactorings cross-packages et les tests d'intégration.

**Statut** : Accepté.
