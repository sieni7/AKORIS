---
title: "AKORIS Control Center — Technical Architecture"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "00-vision.md"
  - "01-system-architecture.md"
  - "03-core.md"
  - "ADR-002-monorepo.md"
  - "ADR-004-fastify.md"
---

# 02 — Technical Architecture

## 1. Objectif

Ce document définit les **choix technologiques**, l'organisation du monorepo, la chaîne de build, la CI/CD, et les outils de développement utilisés pour implémenter l'architecture système définie dans `01-system-architecture.md`.

Tous les choix sont guidés par les principes du Blueprint :
- **Simplicité** : éviter les surcouches inutiles.
- **Évolutivité** : faciliter l'ajout de nouveaux modules ou interfaces.
- **Portabilité** : pouvoir exécuter le projet sur n'importe quelle machine.
- **Maintenabilité** : privilégier les technologies largement adoptées et documentées.

---

## 2. Stack principale

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Monorepo** | pnpm workspaces | Légèreté, rapidité d'installation, isolation des dépendances. |
| **Langage** | TypeScript 5.6+ | Typage fort, adopté par le CLI existant, facilite le partage de code. |
| **Backend API** | Fastify + Zod | Performant, validation native, excellente intégration TypeScript, WebSocket intégré. |
| **Frontend** | React 19 + Vite | Maturité, écosystème riche, Vite pour la rapidité de développement. |
| **UI Components** | shadcn/ui + Tailwind CSS | Composants accessibles, personnalisables, légers, cohérence visuelle. |
| **Graphiques** | Recharts | Basé sur D3, simple à intégrer, bien adapté aux dashboards. |
| **State Management** | TanStack Query (server state) + Zustand (UI state) | Query gère le cache et la synchronisation avec l'API ; Zustand gère l'état local (modale, filtres). |
| **Routing** | TanStack Router | Type-safe, support des routes imbriquées, parfait pour une SPA. |
| **Formulaires** | React Hook Form + Zod | Validation cohérente avec le backend. |
| **Éditeur de code** | Monaco Editor (VS Code) | Intégration idéale pour le Prompt Builder. |
| **WebSocket** | ws (intégré à Fastify) | Simple, efficace, compatible avec le frontend. |
| **Tests** | Vitest (unitaires) + Playwright (E2E) | Vitest rapide pour les unitaires, Playwright pour les tests cross-browser. |
| **Linting / Format** | ESLint + Prettier | Standards de code, automatisation. |
| **CI/CD** | GitHub Actions | Intégration native avec le dépôt. |
| **Conteneurisation** | Docker + docker-compose | Simplifie le déploiement de l'API et du Dashboard en production. |

---

## 3. Structure du monorepo

```
akoris/
├── apps/
│   ├── api/                         # Backend Fastify
│   │   ├── src/
│   │   │   ├── routes/              # Endpoints REST (health, state, registry, logs, command, prompts, secrets)
│   │   │   ├── websocket/           # Canaux WebSocket (logs, notifications, events)
│   │   │   ├── services/            # Services spécifiques à l'API (call Core, transformations)
│   │   │   ├── plugins/             # Plugins Fastify (CORS, rate-limit, auth)
│   │   │   └── index.ts             # Point d'entrée
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   └── dashboard/                   # Frontend React
│       ├── src/
│       │   ├── routes/              # Pages principales : executive, project, ai-studio, devops, registry
│       │   ├── components/          # Composants réutilisables (CommandPalette, Notifications, Timeline)
│       │   ├── lib/                 # Connexion SDK, WebSocket, hooks
│       │   ├── styles/              # Tailwind, global.css
│       │   └── App.tsx
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       └── Dockerfile
│
├── packages/
│   ├── core/                        # Moteur métier (aucune dépendance externe, seulement Node.js)
│   │   ├── src/
│   │   │   ├── registry/            # RegistryReader, validation
│   │   │   ├── state/               # StateMachineEngine, transitions
│   │   │   ├── search/              # SearchEngine, indexation
│   │   │   ├── prompts/             # PromptEngine, contexte
│   │   │   ├── doctor/              # DoctorEngine
│   │   │   ├── secrets/             # SecretManager (chiffrement AES)
│   │   │   ├── logs/                # LogReader, watch
│   │   │   ├── alias/               # AliasManager
│   │   │   ├── quality/             # QualityGateEngine (futur)
│   │   │   ├── types/               # Types internes du Core
│   │   │   └── index.ts             # Point d'entrée public du Core
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── sdk/                         # Client TypeScript pour l'API
│   │   ├── src/
│   │   │   ├── client.ts            # Client HTTP (fetch)
│   │   │   ├── websocket.ts         # Connexion WebSocket
│   │   │   ├── hooks/               # Hooks React (useState, useLogs...)
│   │   │   ├── errors.ts            # Gestion des erreurs
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                      # Types, schémas, constantes partagés
│   │   ├── src/
│   │   │   ├── types/               # Agent, State, LogEntry, Event, etc.
│   │   │   ├── schemas/             # Schémas Zod (validation)
│   │   │   ├── constants/           # Enums, codes d'erreur
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                          # Composants UI réutilisables (shadcn personnalisés)
│       ├── src/
│       │   ├── components/          # Button, Card, Badge, etc.
│       │   ├── themes/              # Thèmes Tailwind
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── registry/                        # Référentiel de gouvernance (existant)
├── docs/                            # Documentation (Blueprint, guides)
├── package.json                     # Racine du monorepo
├── pnpm-workspace.yaml
├── tsconfig.base.json              # Configuration TypeScript partagée
├── .eslintrc.js
├── .prettierrc
├── vitest.config.ts
└── README.md
```

**Règles du monorepo :**
- Chaque package expose une API publique via son `index.ts`.
- Aucun package ne dépend directement d'un autre package sauf via son `index.ts`.
- Les dépendances partagées (React, Tailwind, etc.) sont installées à la racine pour éviter les doublons.

---

## 4. Build et packaging

### 4.1. Scripts racine (`package.json` racine)

```json
{
  "scripts": {
    "dev": "pnpm -r dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "test:e2e": "pnpm -r test:e2e",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "clean": "pnpm -r clean"
  }
}
```

### 4.2. Build des packages

- **Core** : `tsup` (build en CJS et ESM).
- **API** : `tsup` (build ESM, avec `fastify` et `ws` en production).
- **Dashboard** : `vite build` (production static).
- **SDK** : `tsup` (build ESM).
- **Shared** : `tsup` (build CJS/ESM).
- **UI** : `tsup` (build ESM, avec CSS générée par Tailwind).

### 4.3. Docker (production)

**`apps/api/Dockerfile`** :
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**`apps/dashboard/Dockerfile`** :
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`docker-compose.yml`** (racine) :
```yaml
version: "3.8"
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./registry:/app/registry
      - ./.akoris:/app/.akoris
    environment:
      - NODE_ENV=production

  dashboard:
    build:
      context: .
      dockerfile: apps/dashboard/Dockerfile
    ports:
      - "8080:80"
    depends_on:
      - api
```

---

## 5. CI/CD (GitHub Actions)

**Fichier** : `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm format:check

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e
```

**Fichier** : `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 6. Outils de développement

| Outil | Rôle |
|-------|------|
| **ESLint** | Linting TypeScript/React (Airbnb config adaptée). |
| **Prettier** | Formatage automatique. |
| **Vitest** | Tests unitaires et d'intégration. |
| **Playwright** | Tests E2E (Dashboard). |
| **Husky** | Git hooks : lint et format avant commit. |
| **commitlint** | Validation des messages de commit (Conventional Commits). |
| **tsup** | Build rapide des packages. |
| **Vite** | Build du Dashboard. |

---

## 7. Cohérence avec le Blueprint

- Le **Core** est indépendant, ne dépend d'aucun framework (Fastify/React), comme défini dans `01-system-architecture.md`.
- Le **monorepo** facilite la séparation des responsabilités (principe de modularité).
- **Docker** assure la portabilité (principe de remplaçabilité des interfaces).
- **Les tests** sont organisés en pyramide : unitaires (Vitest) + E2E (Playwright), conformément aux exigences de qualité.

---

## 8. Prochaine étape

Une fois ce document validé, nous rédigerons `03-core.md` (les interfaces publiques du Core Engine), qui détaillera exactement les services que le Core expose au CLI, à l'API et au SDK.

---

## Statut

- `00-vision.md` : **Approved**
- `01-system-architecture.md` : **Approved** (validation implicite)
- `02-technical-architecture.md` : **Draft** (prêt pour revue)

**Prochaine action** : Si vous validez ce document, je passe à `03-core.md` (définition des interfaces du Core Engine). Sinon, indiquez-moi les ajustements nécessaires.
