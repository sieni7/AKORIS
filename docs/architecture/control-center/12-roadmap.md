---
title: "AKORIS Control Center — Roadmap"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "00-vision.md"
  - "01-system-architecture.md"
---
# 12 — Roadmap

## 1. Objectif

Ce document définit la feuille de route du développement d'AKORIS Control Center, en cohérence avec la vision et l'architecture validées. Elle est organisée en **4 Milestones**, chacune correspondant à une version publiable.

---

## 2. Principes de priorisation

- **Fondations avant fonctionnalités** : le Core et le monorepo sont prioritaires.
- **MVP avant IA** : le Dashboard doit être opérationnel avant d'ajouter l'AI Studio.
- **Qualité avant vitesse** : chaque Milestone inclut des tests, de la documentation et du hardening.
- **Rétrocompatibilité** : les évolutions ne doivent pas casser les projets existants.

---

## 3. Milestones

### Milestone 1 — Foundation (Core & Monorepo)

**Objectif** : Extraire toute la logique métier du CLI pour créer un package `core` indépendant, structurer le monorepo, et mettre en place les outils de base.

**Durée estimée** : 2 jours

**Livrables :**
- Structure du monorepo pnpm (`apps/`, `packages/`, `pnpm-workspace.yaml`).
- Package `core` contenant : RegistryReader, StateMachineEngine, SearchEngine, LogReader, AliasManager, DoctorEngine, SecretManager (esquisse).
- Package `shared` contenant les types et schémas Zod.
- CLI mis à jour pour consommer le Core.
- Tests unitaires du Core (≥ 80 % de couverture).
- CI mise en place (lint, build, test).

**Critères de validation :**
- `pnpm build` réussit sur l'ensemble du monorepo.
- Le CLI est fonctionnel (`akoris state show`).
- Tous les tests du Core passent.

---

### Milestone 2 — Control Center MVP

**Objectif** : Livrer une interface web fonctionnelle permettant de visualiser l'état du projet et d'exécuter les commandes essentielles.

**Durée estimée** : 5 jours

**Livrables :**
- API Fastify (routes : Health, State, Registry, Search, Logs, Command, Doctor).
- WebSocket `/ws/logs` pour le streaming des logs.
- SDK TypeScript (client REST + WebSocket + hooks React).
- Dashboard React avec :
  - Command Palette (Ctrl+K).
  - Executive (Health Score, Quality Coverage).
  - Project (State Machine interactive).
  - Registry Explorer (arborescence des agents).
  - Logs Live (via WebSocket).
  - Notifications (toasts).
- Tests E2E (Playwright) pour les 5 modules.

**Critères de validation :**
- Un utilisateur peut lancer le Dashboard, voir les KPIs, naviguer dans le Registry.
- La Command Palette permet d'exécuter `state transition`.
- Les logs en direct s'affichent dans l'interface.
- Toutes les routes API retournent des réponses structurées.

---

### Milestone 3 — AI Studio

**Objectif** : Permettre la construction, le test et la sauvegarde de prompts gouvernés.

**Durée estimée** : 3 jours

**Livrables :**
- `PromptEngine` dans le Core (construction de prompts, injection de contexte).
- Context Builder (UI à cocher : ADR, Registry, State, Logs, etc.).
- LLM Playground (appel OpenAI/Anthropic, affichage réponse + tokens).
- Prompt Library (sauvegarde, listage, versionnement).
- Monaco Editor intégré pour le Prompt Builder.

**Critères de validation :**
- Un développeur peut sélectionner un agent, cocher "ADR" et "Registry", générer un prompt, le tester sur GPT-4, et sauvegarder le prompt.
- La réponse du LLM est affichée dans l'interface.
- Les prompts sauvegardés sont listés et peuvent être rechargés.

---

### Milestone 4 — DevOps & Release

**Objectif** : Centraliser les secrets, visualiser les services connectés et piloter les déploiements.

**Durée estimée** : 2 jours

**Livrables :**
- `SecretManager` dans le Core (chiffrement AES-256-GCM).
- Secret Vault (UI de saisie/masquage des tokens).
- Connected Services (statut GitHub, Supabase, Netlify, Vercel).
- Deploy Center (boutons Staging/Production).
- GitHub Actions Viewer (liste des workflows).
- Dockerfile pour l'API et le Dashboard.
- Documentation d'installation du Control Center.

**Critères de validation :**
- Les secrets sont chiffrés et déchiffrés correctement.
- Les déploiements sont déclenchés avec les bons tokens.
- L'application tourne en production via Docker.
- La documentation d'installation est validée par un test sur machine vierge.

---

## 4. Synthèse des délais

| Milestone | Durée | Cumulative |
|-----------|-------|------------|
| M1 — Foundation | 2 jours | Jour 1-2 |
| M2 — MVP | 5 jours | Jour 3-7 |
| M3 — AI Studio | 3 jours | Jour 8-10 |
| M4 — DevOps & Release | 2 jours | Jour 11-12 |

**Total** : 12 jours de développement.

---

## 5. Post-MVP (visions futures)

Après la v1.0 du Control Center, les évolutions suivantes pourront être envisagées :

- **Monte Carlo** : prévisions de livraison basées sur la vélocité passée.
- **Auto-Promotion CI** : déploiement automatique sur Staging si les tests E2E passent.
- **Snapshot Comparatif** : comparaison de deux snapshots pour voir l'évolution de la dette.
- **Journal des prompts** : historique complet des exécutions de prompts.
- **Audit Trail** : journal immuable pour les exigences de conformité.
- **Analytics prédictifs** : détection des risques avant qu'ils ne surviennent.
- **Plugin System** : extension du Dashboard avec des plugins tiers.

---

## 6. Prochaine étape

Après la roadmap, le document `14-extension-model.md` définit comment le système peut être étendu (nouveaux modules, agents, providers, etc.).
