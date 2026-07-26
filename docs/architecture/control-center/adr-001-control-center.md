---
title: "ADR-001 — Architecture du Control Center"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
related:
  - "00-vision.md"
  - "01-system-architecture.md"
---
# ADR-001 — Architecture du Control Center

## Contexte

AKORIS dispose d'un CLI fonctionnel (v1.3.0) mais manque d'une interface web pour piloter le projet, visualiser l'état, et interagir avec les agents. Plusieurs approches sont possibles.

## Décision

Nous adoptons une **architecture en couches** avec un Core Engine indépendant, une API Fastify, un Dashboard React, et un SDK TypeScript.

### Structure retenue

```
Core (TypeScript natif) ← API (Fastify) → SDK ← Dashboard (React)
     ↕                            ↕
CLI (Commander)              WebSocket
```

### Principes

1. **Le Core est unique** : toute la logique métier est dans `packages/core`.
2. **Les interfaces sont interchangeables** : CLI, API, Dashboard consomment le Core.
3. **Communication API/Dashboard** : via REST + WebSocket, pas de partage de code direct.

## Options considérées

1. **Architecture monolithique** (tout dans un seul package) — rejetée car le CLI serait couplé au Dashboard.
2. **Microservices** — rejeté car trop lourd pour un usage local.
3. **Next.js fullstack** — rejeté car le Core doit rester indépendant de React.

## Conséquences

- Le Core est testable sans interface.
- Le CLI peut être refactoré progressivement.
- L'API et le SDK sont nécessaires pour le Dashboard.
- Complexité initiale plus élevée, mais maintenance facilitée.
