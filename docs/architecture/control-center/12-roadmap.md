---
title: "AKORIS Control Center — Roadmap"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "00-vision.md"
  - "03-core.md"
  - "11-sdk.md"
---
# 12 — Roadmap

## 1. Objectif

Ce document définit la **feuille de route** d'implémentation du Control Center, organisée en milestones.

---

## 2. Phases d'implémentation

```
M0 🎯 Architecture Freeze    (Blueprint terminé)
 │
M1 🧱 Core Engine            (packages/core)
 │
M2 📡 API + SDK              (apps/api + packages/sdk)
 │
M3 🖥️ Dashboard MVP          (apps/dashboard)
 │
M4 🔁 Intégration CLI        (apps/cli adapté)
 │
M5 🚀 Release v1.0.0         (Alpha fermée)
```

---

## 3. Détail des milestones

### M1 — Core Engine (j+1 à j+15)

| Tâche | Jours | Dépendances |
|-------|-------|-------------|
| Mise en place du monorepo pnpm | 1 | — |
| Configuration TypeScript, Biome, Vitest | 1 | Monorepo |
| `packages/shared` — types + schémas Zod | 2 | — |
| `packages/core/registry` — RegistryReader | 3 | shared |
| `packages/core/state` — StateMachineEngine | 3 | registry |
| `packages/core/search` — SearchEngine | 2 | registry |
| `packages/core/logs` — LogReader | 1 | — |
| `packages/core/doctor` — DoctorEngine | 2 | registry, state |
| `packages/core/secrets` — SecretManager | 1 | — |
| `packages/core/alias` — AliasManager | 1 | — |
| `packages/core/prompts` — PromptEngine | 3 | registry |
| Tests unitaires (couverture 90%) | Continu | Chaque module |

**Livrable :** `@akoris/core` v0.1.0, `@akoris/shared` v0.1.0

---

### M2 — API + SDK (j+16 à j+23)

| Tâche | Jours | Dépendances |
|-------|-------|-------------|
| `apps/api` — structure Fastify + plugins | 2 | core |
| Routes Health + State | 1 | core |
| Routes Registry | 1 | core |
| Routes Search | 1 | core |
| Routes Prompts | 1 | core |
| Routes Logs + Doctor | 1 | core |
| Routes Secrets + Aliases | 1 | core |
| Routes DevOps + Notifications | 1 | core |
| WebSocket (events + logs) | 2 | core |
| `packages/sdk` — client HTTP | 2 | shared |
| `packages/sdk` — client WebSocket | 1 | — |
| `packages/sdk` — hooks React | 2 | sdk client |

**Livrable :** `@akoris/api` v0.1.0, `@akoris/sdk` v0.1.0

---

### M3 — Dashboard MVP (j+24 à j+35)

| Tâche | Jours | Dépendances |
|-------|-------|-------------|
| Setup Vite + shadcn/ui + Tailwind | 1 | — |
| Layout (Sidebar + Header + Content) | 2 | — |
| Executive Dashboard (health, state) | 3 | sdk |
| Project Dashboard (machine, timeline) | 3 | sdk |
| Registry Explorer (agents, rules, gates) | 3 | sdk |
| AI Studio (prompt builder, LLM test) | 4 | sdk |
| DevOps (secrets, services, deploys) | 3 | sdk |
| Command Palette | 2 | sdk |
| Notifications + Timeline | 2 | sdk |
| Tests E2E (Playwright) | 3 | Dashboard |

**Livrable :** Dashboard v0.1.0

---

### M4 — Intégration CLI (j+36 à j+40)

| Tâche | Jours | Dépendances |
|-------|-------|-------------|
| Refactor CLI pour consommer `@akoris/core` | 3 | core |
| Supprimer les services dupliqués | 1 | CLI refactor |
| Adapter les tests CLI | 1 | CLI refactor |
| Ajouter la commande `akoris serve` | 2 | API |

**Livrable :** CLI v2.0.0 (compatible Core)

---

### M5 — Release v1.0.0 Alpha (j+41 à j+45)

| Tâche | Jours | Dépendances |
|-------|-------|-------------|
| Tests d'intégration complets | 3 | M1→M4 |
| Documentation API (Swagger) | 1 | API |
| Documentation utilisateur | 2 | Dashboard |
| Docker Compose (API + Dashboard) | 1 | API + Dashboard |
| CI/CD (GitHub Actions) | 1 | Monorepo |
| Beta interne (équipe AKORIS) | 3 | Tout |

**Livrable :** Control Center v1.0.0-alpha

---

## 4. Diagramme de Gantt

```
Jours     0    5    10   15   20   25   30   35   40   45
M1 Core   [███████████████]
M2 API    ░░░░░[████████]
M3 Dash   ░░░░░░░░░░[████████████]
M4 CLI    ░░░░░░░░░░░░░░░░░░[█████]
M5 Alpha  ░░░░░░░░░░░░░░░░░░░░░[█████]
```

---

## 5. Dépendances inter-équipes

| Dépendance | Bloquant pour |
|------------|---------------|
| `packages/shared` | Core, API, SDK |
| `packages/core` | API, CLI |
| `apps/api` | SDK, Dashboard |
| `packages/sdk` | Dashboard |
| `apps/api` + `packages/sdk` | Tests E2E |

---

## 6. Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Complexité du PromptEngine | M3 peut glisser | MVP sans LLM, simulé |
| WebSocket temps réel | M2 peut glisser | Fallback polling TanStack Query |
| Refactor CLI | M4 peut glisser | CLI existant reste fonctionnel |
| Disponibilité équipe | Global | Prioriser le Core (M1) |

---

## 7. Prochaine étape

Après la roadmap, le document `14-extension-model.md` définit le modèle d'extension, puis les ADR finalisent les décisions d'architecture.
