# Rapport de Tâche — Core Engine Phase 1

**Tâche :** Implémentation du moteur d'orchestration du Registry v2.0  
**Date :** 25/07/2026  
**Contexte :** AKORIS v2.0.0 — CLI Orchestrator  
**Auteur :** OULAÏ SIÉNI

---

## Table des matières

1. [Objectif](#1-objectif)
2. [Périmètre](#2-périmètre)
3. [Architecture](#3-architecture)
4. [Services implémentés](#4-services-implémentés)
5. [Commandes CLI](#5-commandes-cli)
6. [Fichiers créés](#6-fichiers-créés)
7. [Tests de validation](#7-tests-de-validation)
8. [Dépendances](#8-dépendances)
9. [Points de vigilance](#9-points-de-vigilance)
10. [Prochaines étapes](#10-prochaines-étapes)

---

## 1. Objectif

Permettre au CLI AKORIS d'interpréter et d'exploiter le Registry v2.0 — un registre de gouvernance structuré avec machine à états, matrice d'activation, registre de capacités et règles formelles.

Le CLI passe d'un rôle de **lecture passive** (listing de fichiers) à un rôle **d'orchestrateur actif** capable de :

- Suivre et valider le cycle de vie d'un projet (états et transitions)
- Suggérer les bons agents pour chaque événement du cycle de développement
- Résoudre des besoins en compétences vers des agents disponibles
- Composer des équipes à partir d'un ensemble de tâches

---

## 2. Périmètre

### Inclus

- **4 nouveaux services** dans `packages/cli/src/services/`
- **3 nouvelles commandes** (9 sous-commandes) dans `packages/cli/src/commands/`
- **Types v2** ajoutés dans `packages/cli/src/types/index.ts`
- **2 sous-commandes** ajoutées à la commande `registry` existante
- **Intégration** dans le point d'entrée `index.ts`
- 0 erreur TypeScript au build

### Exclu (phase 2)

- Tests unitaires automatisés (vitest)
- Tests d'intégration
- Documentation générée automatiquement
- Gestion des erreurs avancée (retry, fallback)

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLI AKORIS                                   │
│                                                                      │
│  commands/state.ts  commands/activation.ts  commands/capability.ts   │
│         │                   │                       │                │
│         ▼                   ▼                       ▼                │
│  StateMachineEngine   ActivationEngine      CapabilityResolver       │
│         │                   │                       │                │
│         └───────────────────┼───────────────────────┘                │
│                             │                                        │
│                             ▼                                        │
│                    RegistryReaderV2                                   │
│                             │                                        │
│                             ▼                                        │
│                    ┌───────────────┐                                  │
│                    │ Registry v2.0 │  (disque)                        │
│                    └───────────────┘                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Flux de données

1. `RegistryReaderV2` lit les fichiers du Registry v2.0 sur disque
2. Chaque service spécialisé parse le fichier qui le concerne :
   - `StateMachineEngine` ← `state-machine.json`
   - `ActivationEngine` ← `activation-matrix.json`
   - `CapabilityResolver` ← `capabilities.json`
3. Les commandes CLI exposent ces services via des sous-commandes lisibles

---

## 4. Services implémentés

### 4.1 RegistryReaderV2

**Fichier :** `packages/cli/src/services/registry-reader-v2.service.ts`

| Méthode | Description |
|---------|-------------|
| `getIndex()` | Lit et parse `registry/registry.json` (cache TTL 30s) |
| `getStateMachine()` | Délègue à `StateMachineEngine` |
| `getActivationMatrix()` | Délègue à `ActivationEngine` |
| `getCapabilities()` | Délègue à `CapabilityResolver` |
| `validate()` | Valide la cohérence du Registry v2 |
| `watch(callback)` | Surveille les modifications des fichiers Registry |

**Caractéristiques :**
- Cache avec TTL de 30 secondes
- Callback de notification pour le mode watch
- Validation transversale (agents référencés existent-ils ?)

### 4.2 StateMachineEngine

**Fichier :** `packages/cli/src/services/state-machine.service.ts`

| Méthode | Description |
|---------|-------------|
| `getMachine()` | Retourne la machine à états complète |
| `getCurrentState()` | État courant du projet (dépôt `.akoris/state.json`) |
| `getTransition(from, to)` | Détails d'une transition spécifique |
| `canTransition(from, to)` | Vérifie si une transition est valide |
| `executeTransition(from, to)` | Exécute la transition et persiste le nouvel état |

**Machine à états (7 états, 8 transitions) :**

```
Draft ──► Planned ──► Active ──► Audit ──► Validated ──► Released ──► Archived
  │                      ▲           ▲                                    │
  │                      │           │                                    │
  └──────────────────────┘           └────────────────────────────────────┘
```

| Transition | Gates requis | Autorisation |
|------------|--------------|--------------|
| Draft → Planned | ADR validés, Architecture définie, Backlog priorisé | GOV-02 |
| Planned → Active | Ressources allouées, Environnements prêts, CI/CD configuré | GOV-02 |
| Active → Audit | Feature freeze respecté, Tests rédigés, Documentation préliminaire | CORE-01 |
| Audit → Validated | Security OK, Performance OK, Accessibility OK, Documentation OK, Code quality OK | GOV-02 |
| Validated → Released | Release approuvée, CI/CD green, CHANGELOG mis à jour | GOV-02 |
| Released → Archived | Post-mortem réalisé, Connaissances capitalisées, Documentation finalisée | CORE-01 |
| Active → Planned | Repriorisation nécessaire | CORE-01 |
| Audit → Active | Correctifs appliqués, Nouvel audit planifié | CORE-01 |

### 4.3 ActivationEngine

**Fichier :** `packages/cli/src/services/activation.service.ts`

| Méthode | Description |
|---------|-------------|
| `getMatrix()` | Retourne la matrice d'activation complète |
| `suggestAgents(eventId)` | Suggère les agents activés par un événement |
| `getEventsByPhase(phase)` | Filtre les événements par phase |
| `getAllPhases()` | Liste toutes les phases disponibles |

**18 événements répartis en 8 phases :**

| Phase | Événements |
|-------|------------|
| Initiation | PROJECT_INIT |
| Développement | SPRINT_START, FEATURE_START |
| Review | SPRINT_REVIEW |
| Design | ARCHITECTURE_DECISION |
| Qualité | CODE_REVIEW, SECURITY_AUDIT, PERFORMANCE_AUDIT, ACCESSIBILITY_AUDIT, DOCUMENTATION_AUDIT, TECHNICAL_DEBT_REVIEW |
| Gouvernance | QUALITY_GATE, COMPLIANCE_AUDIT |
| Release | RELEASE_PREP, RELEASE_APPROVED |
| Opérations | INCIDENT |
| Amélioration | PROJECT_RETRO, KNOWLEDGE_CAPTURE |

### 4.4 CapabilityResolver

**Fichier :** `packages/cli/src/services/capability.service.ts`

| Méthode | Description |
|---------|-------------|
| `getAllCapabilities()` | Liste toutes les capacités du registre |
| `findAgentForCapability(capId)` | Résout une compétence → agent(s) |
| `searchCapabilities(keyword)` | Recherche plein texte dans les capacités |
| `composeTeam(taskIds)` | Compose une équipe optimale pour un ensemble de tâches |
| `getCapabilityGaps(taskIds)` | Identifie les compétences non couvertes |

**69 capacités réparties :**

| Domaine | Capacités | Exemples |
|---------|-----------|----------|
| CORE (Gouvernance) | 20 | design_architecture, coordinate_agents, validate_transitions |
| DEV (Développement) | 10 | design_rest_api, design_component_tree, implement_service_workers |
| QA (Qualité) | 9 | review_code_quality, write_unit_tests, audit_owasp |
| EXP (Expertise) | 12 | optimize_prompts, design_multi_tenant, audit_rgpd |
| GOV (Gouvernance transverse) | 9 | enforce_constitution, validate_quality_gates, capitalize_experience |

---

## 5. Commandes CLI

### 5.1 `akoris state`

Gère la machine à états du projet AKORIS.

| Sous-commande | Usage | Description |
|---------------|-------|-------------|
| `show` | `akoris state show` | Affiche l'état courant, les états définis, les transitions possibles |
| `history` | `akoris state history` | Historique des transitions (depuis `.akoris/state-history.json`) |
| `transition` | `akoris state transition --from Draft --to Planned` | Exécute une transition avec validation des gates |
| `info` | `akoris state info` | Détails complets de la machine à états |

### 5.2 `akoris activation`

Gère la matrice d'activation des agents.

| Sous-commande | Usage | Description |
|---------------|-------|-------------|
| `list` | `akoris activation list` | Liste tous les événements et leurs agents activés |
| `suggest` | `akoris activation suggest --event RELEASE_PREP` | Suggère les agents pour un événement spécifique |
| `events` | `akoris activation events` | Liste les événements disponibles |

### 5.3 `akoris capability`

Gère le registre des capacités.

| Sous-commande | Usage | Description |
|---------------|-------|-------------|
| `list` | `akoris capability list` | Liste toutes les capacités avec leurs agents |
| `find` | `akoris capability find design_architecture` | Trouve un agent pour une capacité spécifique |
| `search` | `akoris capability search api` | Recherche par mot-clé dans les capacités |
| `team` | `akoris capability team design_architecture audit_security` | Compose une équipe pour un ensemble de tâches |

---

## 6. Fichiers créés

| Fichier | Lignes | Rôle |
|---------|--------|------|
| `packages/cli/src/services/registry-reader-v2.service.ts` | 133 | Cache, watch, validation du Registry v2 |
| `packages/cli/src/services/state-machine.service.ts` | 167 | Machine à 7 états, transitions, persistance |
| `packages/cli/src/services/activation.service.ts` | 95 | Matrice d'activation 18 événements |
| `packages/cli/src/services/capability.service.ts` | 127 | Résolution 69 capacités, composition équipe |
| `packages/cli/src/commands/state.ts` | 143 | 4 sous-commandes state |
| `packages/cli/src/commands/activation.ts` | 97 | 3 sous-commandes activation |
| `packages/cli/src/commands/capability.ts` | 125 | 4 sous-commandes capability |

**Fichiers modifiés :**

| Fichier | Changement |
|---------|-----------|
| `packages/cli/src/types/index.ts` | +6 interfaces v2 (StateMachine, ActivationMatrix, CapabilityRegistry, DependencyGraph, RegistryIndex, ProjectState) |
| `packages/cli/src/commands/registry.ts` | +2 sous-commandes (index, watch) |
| `packages/cli/src/index.ts` | +3 imports, +4 programme addCommand, +3 lignes dans banner |

**Total : 10 fichiers — 1091 lignes ajoutées**

---

## 7. Tests de validation

Toutes les commandes ont été testées avec succès en ligne de commande :

```powershell
# Machine à états
akoris state show             → ✅ État Draft, transitions possibles
akoris state info             → ✅ 7 états, 8 transitions
akoris state transition --from Draft --to Planned  → ✅ Transition exécutée

# Activation
akoris activation list        → ✅ 18 événements listés
akoris activation suggest --event RELEASE_PREP     → ✅ 7 agents suggérés

# Capacités
akoris capability list        → ✅ 69 capacités listées
akoris capability find design_architecture          → ✅ CORE-02, DEV-01, DEV-02
akoris capability team design_architecture audit_security  → ✅ Équipe composée

# Registry v2
akoris registry index         → ✅ Index complet (33 agents, 18 events, 15 deliverables...)
akoris registry watch         → ✅ Surveillance active
akoris registry validate      → ✅ Registry valide
```

**Build :** `pnpm build` → 0 erreur TypeScript

---

## 8. Dépendances

### Dépendances du Registry v2 (source de données)

| Fichier Registry | Service client |
|-----------------|----------------|
| `registry/registry.json` | RegistryReaderV2.getIndex() |
| `registry/state-machine.json` | StateMachineEngine.getMachine() |
| `registry/activation-matrix.json` | ActivationEngine.getMatrix() |
| `registry/capabilities.json` | CapabilityResolver.getAllCapabilities() |
| `registry/agents/*/agent.json` | Validation croisée |

### Dépendances internes

| Service | Dépend de |
|---------|-----------|
| StateMachineEngine | RegistryReaderV2 (pour validation de coherence) |
| ActivationEngine | RegistryReaderV2 |
| CapabilityResolver | RegistryReaderV2 |
| commands/state | StateMachineEngine |
| commands/activation | ActivationEngine |
| commands/capability | CapabilityResolver |

---

## 9. Points de vigilance

### Résolu

- **Transition `Draft → Active` sans passer par `Planned`** : la machine valide le chemin, la commande `transition` refuse la transition si elle n'est pas définie dans `state-machine.json`

### À surveiller

- **État persistant :** le fichier `.akoris/state.json` est créé/modifié par `state transition`. Si le répertoire `.akoris/` n'existe pas, la commande le crée automatiquement
- **Cache TTL :** `RegistryReaderV2` utilise un cache de 30 secondes. En mode `registry watch`, le cache est automatiquement invalidé sur détection de changement
- **Composition d'équipe (`capability team`)** : ne prend pas encore en compte la charge de travail des agents (tous les agents matchés sont retournés)
- **Types v2 vs v1 :** les types v2 sont dans `types/index.ts` aux côtés des types v1. Une séparation future dans `types/v2/` serait plus propre

### Non couvert (phase 2)

- Gestion des conflits de transition (deux transitions simultanées)
- Remplissage des quality gates (la commande `state transition` liste les gates mais ne les exécute pas)
- Mode dégradé si Registry v2 partiellement absent

---

## 10. Prochaines étapes

### Phase 2 — Tests et robustesse

- `pnpm vitest run` avec tests unitaires pour chaque service
- Tests d'intégration : cycle complet Draft → Released
- Mock du Registry v2 pour les tests
- Gestion des erreurs avancée

### Phase 3 — Documentation

- Auto-documentation des commandes (`akoris state --help` enrichi)
- Diagrammes Mermaid dans l'aide
- Site de documentation avec exemples

### Phase 4 — SOPs

- Standard Operating Procedures pour chaque transition
- Playbook d'onboarding AKORIS
- Guide de contribution et d'extension du Registry

### Phase 5 — API REST du Registry

- Exposition des services via une API REST
- Client HTTP dans le SDK
- Dashboard web de monitoring

---

*Rapport généré le 25/07/2026 — AKORIS v2.0.0*
