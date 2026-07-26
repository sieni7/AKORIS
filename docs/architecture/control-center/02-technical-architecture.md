---
title: "AKORIS Control Center — Technical Architecture"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "01-system-architecture.md"
  - "03-core.md"
  - "ADR-001-control-center.md"
---

# 02 — Technical Architecture

## 1. Stack technologique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Monorepo** | pnpm workspaces | Standardisation, déjà utilisé par le CLI |
| **Langage** | TypeScript 5.x (strict) | Typage fort, partagé entre toutes les couches |
| **Core** | TypeScript natif (0 dépendance externe) | Portabilité, testabilité, indépendance |
| **API** | Fastify 5.x | Performance, validation native (Zod), WebSocket, plugins |
| **Schema/Validation** | Zod 3.x | Typage statique + validation runtime, partageable |
| **Dashboard** | React 19 + Vite 6 | Standard, HMR rapide, écosystème riche |
| **UI Components** | shadcn/ui + Tailwind CSS 4 | Composants accessibles, personnalisables, copiés pas hérités |
| **WebSocket** | Fastify WebSocket (@fastify/websocket) | Streaming logs, événements temps réel |
| **SDK** | TypeScript natif (fetch) | 0 dépendance, compatible Node/browser |
| **Secrets** | crypto (AES-256-GCM) natif Node.js | Pas de dépendance externe |
| **Build** | tsc (Core, API, SDK), Vite (Dashboard) | Simplicité, pas de bundler lourd |
| **Lint** | Biome | Rapide, unified (lint + format), remplace ESLint + Prettier |
| **Test** | Vitest | Rapide, compatible ESM, déjà utilisé |
| **CI** | GitHub Actions | Intégration native avec le dépôt |

### Pourquoi pas ?

| Technologie | Raison du rejet |
|-------------|-----------------|
| **NestJS** | Trop opinionated pour l'API ; Fastify nous donne le contrôle |
| **Express** | Moins performant, pas de validation native |
| **Next.js** | Trop lourd pour un dashboard statique ; Vite suffit |
| **tRPC** | Nécessite un client côté Dashboard ; REST + SDK est plus universel |
| **Prisma** | Pas de base de données ; tout est fichier JSON |
| **Redis** | Pas nécessaire en v1.0 (le Core charge tout en mémoire) |

---

## 2. Structure du monorepo

```
akoris/
├── pnpm-workspace.yaml
├── package.json               # Racine (scripts, devDeps communes)
├── tsconfig.base.json         # Config TypeScript de base
├── biome.json                 # Lint + format global
│
├── packages/
│   ├── shared/                # Types, schémas Zod, constantes
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── types/         # Agent, State, LogEntry, Prompt, etc.
│   │   │   ├── schemas/       # Schémas Zod (request/response API)
│   │   │   └── constants.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── core/                  # Logique métier (0 dépendance)
│       ├── src/
│       │   ├── index.ts       # Barillet d'export
│       │   ├── registry/      # RegistryReader, validations
│       │   ├── state/         # StateMachineEngine
│       │   ├── search/        # SearchEngine
│       │   ├── logs/          # LogReader
│       │   ├── alias/         # AliasManager
│       │   ├── doctor/        # DoctorEngine
│       │   ├── prompts/       # PromptEngine
│       │   └── secrets/       # SecretManager
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── cli/                   # CLI actuel, adapté pour consommer le Core
│   │   └── ...
│   │
│   ├── api/                   # API Fastify
│   │   ├── src/
│   │   │   ├── index.ts       # Entry point
│   │   │   ├── routes/        # state.ts, search.ts, logs.ts, prompts.ts, ...
│   │   │   ├── websocket/     # logs.ts, events.ts
│   │   │   ├── middleware/    # error-handler.ts, cors.ts
│   │   │   └── plugins/       # swagger.ts, sensible.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── dashboard/             # React + Vite
│       ├── src/
│       │   ├── App.tsx
│       │   ├── routes/        # executive/, project/, registry/, ai-studio/, devops/
│       │   ├── components/    # ui/ (shadcn), shared/
│       │   ├── hooks/         # useWebSocket, useCommandPalette, useSearch
│       │   ├── lib/           # SDK wrapper, utils
│       │   └── styles/        # globals.css (Tailwind)
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
└── sdk/                       # (optionnel, peut être dans packages/)
    └── src/
        ├── client.ts          # HTTP client (fetch)
        ├── state.ts           # state.get(), state.transition()
        ├── search.ts          # search.query()
        ├── logs.ts            # logs.list(), logs.watch() (WS)
        ├── prompts.ts         # prompts.build(), prompts.test(), prompts.save()
        └── types.ts           # Réexport de shared
```

---

## 3. Règles de build

```bash
# Installer toutes les dépendances
pnpm install

# Build tout le monorepo (ordre : shared → core → api → sdk → dashboard)
pnpm build

# Build un seul package
pnpm --filter @akoris/core build

# Tests
pnpm test                          # Tout le monorepo
pnpm --filter @akoris/core test    # Core uniquement

# Lint
pnpm lint

# Dev (API + Dashboard)
pnpm dev                           # Lance API et Dashboard en parallèle
```

**Ordre de build explicite :** `shared → core → api → sdk → dashboard`

Chaque package déclare ses dépendances dans `package.json` :

```json
// packages/core/package.json
{
  "name": "@akoris/core",
  "dependencies": {
    "@akoris/shared": "workspace:*"
  }
}
```

---

## 4. API Design

### Principes

- **RESTful** pour les opérations CRUD et les commandes
- **WebSocket** pour les événements temps réel (logs, notifications)
- **Versionnement** par préfixe : `/api/v1/...`
- **Validation** : tous les endpoints valident les entrées avec Zod
- **Erreurs** : format standardisé (code, message, suggestion)

### Structure des routes

```
GET    /api/v1/health                  # Santé du service
GET    /api/v1/state                   # État courant
GET    /api/v1/state/history           # Historique des transitions
POST   /api/v1/state/transition        # Exécuter une transition

GET    /api/v1/search?q={query}&type={type}

GET    /api/v1/registry/agents         # Liste des agents
GET    /api/v1/registry/agents/:id     # Détail d'un agent
GET    /api/v1/registry/rules          # Liste des règles
GET    /api/v1/registry/capabilities   # Liste des capacités

GET    /api/v1/logs?lines=20&agent=CORE-01
WS     /ws/v1/logs                     # Streaming des logs

POST   /api/v1/prompts/build           # Construire un prompt
POST   /api/v1/prompts/test            # Tester un prompt (LLM)
POST   /api/v1/prompts/save            # Sauvegarder un prompt
GET    /api/v1/prompts                 # Liste des prompts sauvegardés

GET    /api/v1/command                 # Exécuter une commande CLI
```

### Format de réponse standard

```typescript
// Succès
{
  "success": true,
  "data": { ... },        // Données spécifiques à l'endpoint
  "meta": {
    "timestamp": "2026-07-26T12:00:00Z",
    "duration": 42        // ms
  }
}

// Erreur
{
  "success": false,
  "error": {
    "code": "STATE_TRANSITION_DENIED",
    "message": "Transition \"Draft → Active\" non définie",
    "suggestion": "Transitions possibles : Planned",
    "details": { ... }    // Optionnel
  },
  "meta": {
    "timestamp": "2026-07-26T12:00:00Z",
    "duration": 5
  }
}
```

---

## 5. WebSocket

### Connexion

```
WS /ws/v1/logs
```

### Format des messages

```typescript
// Serveur → Client
{
  "type": "log:entry",
  "data": {
    "timestamp": "2026-07-26T12:00:00Z",
    "agentId": "CORE-01",
    "action": "transition",
    "details": "Draft → Planned"
  }
}

// Événements système
{
  "type": "state:changed",
  "data": {
    "from": "Draft",
    "to": "Planned",
    "at": "2026-07-26T12:00:00Z"
  }
}
```

---

## 6. Sécurité

| Point | Mesure |
|-------|--------|
| **Secrets** | Chiffrement AES-256-GCM via `crypto` natif, fichier `.akoris/secrets.enc` |
| **CORS** | Configuré pour l'origine du Dashboard (localhost:5173 en dev) |
| **Headers** | Helmet-like via `@fastify/helmet` (ou équivalent) |
| **Validation** | Tous les endpoints valident les entrées avec Zod |
| **Authentification** | Hors périmètre v1.0 (usage local uniquement) |

---

## 7. CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm build
      - run: pnpm test
```

---

## 8. Contraintes techniques

| Contrainte | Décision |
|------------|----------|
| **Node.js** | >= 18 (Aligned avec le CLI) |
| **Port API** | 3001 |
| **Port Dashboard (dev)** | 5173 (Vite par défaut) |
| **Pas de BDD** | Tout est fichier JSON (git-friendly) |
| **Pas d'auth** | v1.0 en local uniquement |
| **Temps réel** | WebSocket, pas de polling |
| **Dashboard** | SPA statique, servie par l'API ou un reverse proxy |

---

**Prochaine étape** : Validation de `02-technical-architecture.md`, puis rédaction de `03-core.md` (API publique du Core).
