---
title: "ADR-004 — Fastify pour l'API REST"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
related:
  - "02-technical-architecture.md"
  - "05-api-contract.md"
  - "07-websocket.md"
---
# ADR-004 — Fastify pour l'API REST

## Contexte

Le Control Center a besoin d'une API REST pour exposer le Core Engine au Dashboard et au SDK. Plusieurs frameworks Node.js sont disponibles.

## Décision

Nous utilisons **Fastify 5.x** pour `apps/api`.

### Justification

1. **Performance** : Fastify est 2-3x plus rapide qu'Express.
2. **Validation native** : via `@fastify/type-provider-typebox` ou Zod.
3. **WebSocket intégré** : `@fastify/websocket` sans configuration complexe.
4. **Plugin ecosystem** : CORS, Helmet, Rate Limit, Swagger.
5. **TypeScript first** : typage fort de bout en bout.
6. **Déjà connu** : l'équipe a de l'expérience avec Fastify.

## Options considérées

| Framework | Raison du rejet |
|-----------|-----------------|
| **Express** | Moins performant, pas de validation native, écosystème moins structuré |
| **NestJS** | Trop opinionated, surcharge pour notre cas |
| **Hono** | Bon mais moins mature, écosystème plus petit |
| **tRPC** | Nécessite un client spécifique, pas standard REST |

## Conséquences

- Les routes sont déclarées avec validation Zod.
- WebSocket sur `/ws/*` avec `@fastify/websocket`.
- Swagger généré automatiquement pour la documentation API.
- L'API reste une couche fine (toute la logique est dans le Core).
