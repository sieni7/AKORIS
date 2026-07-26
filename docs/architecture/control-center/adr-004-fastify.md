---
title: "ADR-004 — Fastify (API)"
status: "accepted"
date: "2026-07-26"
author: "AKORIS Core Team"
---
# ADR-004 : Fastify (API)

**Contexte** : L'API doit être rapide, typée, et supporter WebSocket pour les logs en temps réel.

**Décision** : Utiliser Fastify avec Zod pour la validation et `@fastify/websocket` pour les WebSockets.

**Alternatives** : Express (plus lent, moins typé), NestJS (plus lourd).

**Justification** : Fastify est performant, intègre nativement la validation (Zod), et a une excellente intégration TypeScript. Il est léger et facile à tester.

**Statut** : Accepté.
