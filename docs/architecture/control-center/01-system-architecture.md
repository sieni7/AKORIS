---
title: "AKORIS Control Center — System Architecture"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "00-vision.md"
  - "02-technical-architecture.md"
  - "03-core.md"
---

# 01 — System Architecture

## 1. Architecture globale

Le Control Center suit une architecture **monorepo modulaire** avec séparation stricte entre le **Core** (logique métier) et les **interfaces** (API, Dashboard, CLI).

```
┌─────────────────────────────────────────────────────┐
│                   apps/                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   CLI    │  │   API    │  │   Dashboard      │  │
│  │ (actuel) │  │ (Fastify)│  │ (React + Vite)   │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │             │                 │             │
├───────┴─────────────┴─────────────────┴─────────────┤
│                   packages/                          │
│  ┌────────────────────────┐  ┌──────────────────┐   │
│  │   core                 │  │   shared         │   │
│  │ (RegistryReader,       │  │ (types, schemas, │   │
│  │  StateMachineEngine,   │  │  constants)      │   │
│  │  SearchEngine,         │  │                  │   │
│  │  LogReader,            │  │                  │   │
│  │  AliasManager,         │  │                  │   │
│  │  DoctorEngine,         │  │                  │   │
│  │  PromptEngine,         │  │                  │   │
│  │  SecretManager)        │  │                  │   │
│  └────────────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Bounded Contexts

Le système est découpé en 5 contexts métier, chacun responsable d'un domaine cohérent.

### 2.1 Context "Registry"

- **Responsabilité** : Gérer le référentiel de gouvernance (agents, règles, événements, livrables, quality gates).
- **Entités** : `Agent`, `Rule`, `Event`, `Deliverable`, `QualityGate`, `Capability`
- **Service** : `RegistryReaderV2` (lecture, cache, validation)
- **Sources** : `registry/` (fichiers JSON sur disque)
- **Dépendances** : Aucune (c'est la racine du système)

### 2.2 Context "State"

- **Responsabilité** : Gérer le cycle de vie du projet (états, transitions, historique).
- **Entités** : `State`, `Transition`, `HistoryEntry`
- **Service** : `StateMachineEngine`
- **Sources** : `registry/state-machine.json` + `.akoris/state.json`
- **Dépendances** : Registry (lecture de la machine)

### 2.3 Context "Observability"

- **Responsabilité** : Collecter, stocker et exposer les logs d'exécution.
- **Entités** : `LogEntry`, `LogFilter`
- **Service** : `LogReader`
- **Sources** : `.akoris/logs/sessions/*.json`
- **Dépendances** : Aucune

### 2.4 Context "AI Studio"

- **Responsabilité** : Construire des prompts contextualisés, orchestrer les appels LLM.
- **Entités** : `Prompt`, `ContextFragment`, `LLMResponse`
- **Service** : `PromptEngine`
- **Sources** : Registry, ADR, Logs (contexte injecté)
- **Dépendances** : Registry, State, Observability (pour le contexte)

### 2.5 Context "DevOps"

- **Responsabilité** : Gérer les secrets, superviser les services connectés, piloter les déploiements.
- **Entités** : `Secret`, `ConnectedService`, `Deployment`
- **Service** : `SecretManager`
- **Sources** : `.akoris/secrets.enc` (chiffré)
- **Dépendances** : Registry (lecture des providers configurés)

---

## 3. Flux métier principaux

### 3.1 Exécution d'une commande

```
Utilisateur (Dashboard/CLI)
  → app (API/CLI)
    → core (service métier)
      → lit les données (Registry, state.json, logs)
      → exécute la logique (transition, search, audit)
      → persiste si nécessaire (state.json)
    ← retourne le résultat structuré
  → formate et affiche (JSON / texte / composant React)
← Utilisateur voit le résultat
```

**Règle** : Aucune logique métier dans `apps/`. Toute décision est dans `packages/core`.

### 3.2 Transition d'état

```
1. Dashboard : utilisateur clique "Planned → Active"
2. Dashboard → SDK.command.run("state", ["transition", "--from", "Planned", "--to", "Active"])
3. SDK → API POST /api/command { command: "state transition --from Planned --to Active" }
4. API → Core.StateMachineEngine.transition("Planned", "Active")
5. Core vérifie : état courant = Planned, transition valide, gates ok
6. Core écrit dans .akoris/state.json
7. API → LogReader.appendLog({ agentId: "CORE-01", action: "transition", details: "Planned → Active" })
8. API → Dashboard (réponse + WebSocket notification)
```

### 3.3 Recherche fédérée

```
1. Dashboard : utilisateur tape "database" dans la Command Palette
2. Dashboard → SDK.search.query("database")
3. SDK → API GET /api/search?q=database
4. API → Core.SearchEngine.search("database")
5. Core interroge : agents, règles, capacités, livrables, événements, ADRs, logs
6. Core retourne les résultats groupés par type
7. API → Dashboard (JSON structuré)
8. Dashboard affiche dans une liste groupée
```

### 3.4 Génération de prompt (AI Studio)

```
1. Dashboard : utilisateur sélectionne un agent + coche "ADR + Registry"
2. Dashboard → SDK.prompts.build({ agentId: "DEV-01", context: ["adr", "registry"] })
3. SDK → API POST /api/prompts/build { agentId, context }
4. API → Core.PromptEngine.build({ agentId, context })
5. Core injecte : contrat de l'agent, ADRs récents, règles associées
6. Core retourne le prompt construit
7. Dashboard : utilisateur modifie le prompt dans Monaco
8. Dashboard → API POST /api/prompts/test { prompt, provider: "openai" }
9. API → Core.PromptEngine.test(prompt, provider)
10. Core appelle l'API LLM (OpenAI/Anthropic)
11. Core retourne la réponse + métriques (tokens, temps)
12. Dashboard : utilisateur sauvegarde le prompt
13. Dashboard → API POST /api/prompts/save { prompt, name, agentId }
```

---

## 4. Diagramme de dépendances entre packages

```
shared       → (indépendant)
core         → shared
cli          → core, shared
sdk          → shared
api          → core, sdk, shared
dashboard    → sdk, shared
```

Tout package peut dépendre de `shared`. Rien ne dépend de `cli`. Le `core` ne dépend que de `shared`.

---

## 5. Flux de données

```
┌──────────────┐     Registry JSON     ┌──────────────┐
│              │ ◄──────────────────── │              │
│   Core       │    state.json         │   File       │
│   (mémoire)  │ ◄──────────────────── │   System     │
│              │    logs/*.json        │   (disque)   │
│              │ ◄──────────────────── │              │
└──────┬───────┘                       └──────────────┘
       │
       │ API REST / WebSocket
       ▼
┌──────────────┐     TypeScript SDK    ┌──────────────┐
│   API        │ ◄──────────────────── │   Dashboard  │
│   (Fastify)  │ ────────────────────► │   (React)    │
└──────────────┘      JSON/WS          └──────────────┘
```

---

## 6. Déploiement (cible)

```
┌────────────────────────────────────────────────────┐
│                   Machine hôte                      │
│                                                     │
│  ┌────────────────────┐   ┌────────────────────┐   │
│  │  API (Fastify)     │   │  Dashboard (Vite)  │   │
│  │  Port 3001         │   │  Port 5173 (dev)   │   │
│  │                    │   │  Port 80 (prod)    │   │
│  └────────┬───────────┘   └────────┬───────────┘   │
│           │                        │                │
│           └──────────┬─────────────┘                │
│                      │                              │
│           ┌──────────▼──────────┐                   │
│           │   File System       │                   │
│           │   .akoris/          │                   │
│           │   registry/         │                   │
│           └─────────────────────┘                   │
└────────────────────────────────────────────────────┘
```

Le déploiement est monolithique (pas de microservices). L'API et le Dashboard partagent le même filesystem local.

---

## 7. Contraintes

| Contrainte | Implication |
|------------|-------------|
| Pas de base de données externe | Tout est fichier JSON (git-friendly) |
| Pas d'authentification en v1.0 | Usage local uniquement |
| Le Core ne doit pas dépendre de Node.js spécifique | Écrire en TypeScript portable |
| Les contrats API sont en Zod | Validation au runtime + typage statique |
| Le Dashboard est une SPA statique | Servie par l'API ou un reverse proxy |
