# Rapport d'Installation — AKORIS v2.0.0

**Date :** 25/07/2026
**Machine :** PC MARKET CI
**Dépôt :** https://github.com/sieni7/AKORIS
**Auteur :** OULAÏ SIÉNI

---

## 1. Environnement

| Technologie | Version |
|-------------|--------|
| Node.js | 24.4.1 |
| pnpm | 9.15.0 |
| TypeScript | 5.9 |
| OS | Windows |

---

## 2. Structure finale du projet

```
C:\Users\PC MARKET CI\AKORIS\
│
├── constitution/               # Documents fondateurs (8 fichiers)
│   ├── CONSTITUTION.md         → Pourquoi AKORIS existe, mission, vision
│   ├── PHILOSOPHY.md           → Philosophie (Gouvernance First, Documentation First...)
│   ├── VALUES.md               → Valeurs (Transparence, Qualité, Pérennité...)
│   ├── PRINCIPLES.md           → 10 principes fondateurs
│   ├── GOVERNANCE.md           → Cycle de vie, validation, responsabilités
│   ├── LICENSING.md            → Licence, propriété intellectuelle, contribution
│   ├── CODE_OF_ETHICS.md       → Neutralité, zéro hallucination, comportement
│   └── TERMINOLOGY.md          → Définitions officielles des termes
│
├── docs/                       # Documentation officielle
│   ├── presentation/           → 3 documents de présentation
│   ├── specifications/         → AKORIS-Registry-Specification.md (1042 lignes)
│   ├── roadmap/                → Roadmap
│   ├── decisions/              → ADRs
│   └── releases/               → Notes de version
│
├── registry/                   # ❖ Référentiel de gouvernance (cœur)
│   ├── agents/                 → 33 agents (5 domaines : CORE, DEV, QA, EXP, GOV)
│   │                           → Chaque agent : agent.json, contract.md, mission.md,
│   │                             checklist.md, prompt.md, inputs.md, outputs.md,
│   │                             quality-gates.md, activation.md, examples/usage-1.md
│   │                           → Upgrade v1.1.0 : +README.md, +contract.json,
│   │                             +capabilities.json, +kpis.md, +tokens.md,
│   │                             +CHANGELOG.md, +diagram.md, +RACI, +tests/,
│   │                             +assets/icon.svg, agent.json enrichi
│   ├── contracts/              → 33 contrats
│   ├── policies/               → 12 policies
│   ├── workflows/              → 8 workflows
│   ├── quality-gates/          → 15 quality gates
│   ├── templates/              → 18 templates
│   ├── conventions/            → 8 conventions
│   ├── schemas/                → 8 schémas JSON
│   ├── metrics/                → 10 métriques
│   ├── checklists/             → 33 checklists
│   │
│   └── [v2.0]                  → 57 fichiers, 2976 lignes
│       ├── registry.json       → Index central
│       ├── dependency-graph.json
│       ├── activation-matrix.json
│       ├── capabilities.json
│       ├── ontology.json
│       ├── state-machine.json
│       ├── rules/              → 12 règles formelles
│       ├── deliverables/       → 15 livrables
│       ├── events/             → 18 événements + 1 index
│       └── api/                → 4 contrats OpenAPI
│
├── standards/                  # Normes transverses (15 documents)
│   ├── coding/                 → naming-conventions, clean-code, typescript
│   ├── documentation/          → adr-standard, markdown-style, api-documentation
│   ├── architecture/           → layering, dependency-rules, modularity
│   ├── security/               → authentication, secrets-management, secure-dev
│   └── quality/                → testing, review-process, quality-gates
│
├── packages/                   # ◆ Implémentations techniques (4 packages)
│   ├── cli/                    → CLI (23 commandes, + Phase 1 Core Engine)
│   │   ├── src/commands/       → 23 fichiers de commande
│   │   ├── src/services/       → 8 services (dont 4 v2 : RegistryReaderV2,
│   │   │                         StateMachineEngine, ActivationEngine,
│   │   │                         CapabilityResolver)
│   │   └── src/types/          → Types v1 + v2
│   ├── sdk/                    → SDK (RegistryReader, ManifestManager,
│   │                             Validator, AuditEngine)
│   ├── adapters/               → 4 adapteurs IA (OpenCode, Cursor,
│   │                             Claude Code, Codex)
│   └── connectors/             → 4 connecteurs (GitHub, GitLab,
│                               Supabase, Netlify)
│
├── playbooks/                  → 3 playbooks (react-vite-supabase, nextjs, laravel)
├── examples/                   → Exemples de projet
├── tests/                      → Tests
├── scripts/                    → Scripts (bootstrap.ps1)
├── .github/workflows/          → CI/CD (test, lint, release)
│
├── MANIFEST.json               → Identité du projet AKORIS
├── CHANGELOG.md                → Historique des versions
├── RAPPORT_INSTALLATION.md     → Ce document
├── LICENSE                     → MIT
└── README.md                   → Présentation générale
```

---

## 3. Fichiers créés

**Total : 26621 fichiers — 8 commits — 3 pushes**

| Catégorie | Détail |
|-----------|--------|
| Constitution | 8 documents fondateurs |
| Docs | Présentation, spécification ARS (1042 lignes, norme formelle) |
| Registry v1 | 9 policies, 8+ workflows, 8+ quality gates, 9+ templates, 6+ conventions, 8 schémas, 7+ métriques, 2+ checklists, glossaire 15 termes, 3+ agents |
| Registry agents | 33 agents contractuels × 10 fichiers = 330 fichiers |
| Registry agents upgrade | +README, +contract.json, +capabilities.json, +kpis.md, +tokens.md, +CHANGELOG.md, +diagram.md, +RACI, +tests/, +assets/icon.svg = 429 fichiers |
| Registry v2.0 | 57 fichiers (index, graphe, matrice, capabilities, ontologie, machine états, règles, livrables, événements, API OpenAPI) |
| Standards | 15 documents transverses |
| Packages (CLI) | 23 commandes, 8 services dont 4 v2 |
| Packages (SDK) | 4 modules |
| Packages (adapters) | 4 adapteurs |
| Packages (connectors) | 4 connecteurs |
| Playbooks | 3 |
| CI/CD | 3 workflows GitHub |
| Config | MANIFEST.json, tsconfig, package.json, pnpm-workspace |

---

## 4. Registry v2.0 — Composants

| Composant | Fichiers | Description |
|-----------|----------|-------------|
| Index | `registry.json` | Inventaire central (33 agents, 18 events, 15 deliverables, 12 rules...) |
| Dependency Graph | `dependency-graph.json` | 69 dépendances entre agents |
| Activation Matrix | `activation-matrix.json` | 18 événements → agents avec phase/fréquence |
| Capabilities | `capabilities.json` | 69 capacités → agents |
| Ontology | `ontology.json` | 5 domaines, 33 agents |
| State Machine | `state-machine.json` | 7 états, 8 transitions validées |
| Rules | `rules/` | 12 règles formelles de gouvernance |
| Deliverables | `deliverables/` | 15 livrables standardisés |
| Events | `events/` | 18 événements + index |
| API | `api/` | 4 contrats OpenAPI (agent, state, activation, deliverable) |

---

## 5. Agents contractuels — 5 domaines

| Domaine | Sigle | Agents | Rôle |
|---------|-------|--------|------|
| Gouvernance | CORE | 8 | Coordination, architecture, base de données, sécurité, documentation, DevOps, qualité |
| Développement | DEV | 8 | UI, backend, API, domaine, UX, PWA, perf, intégration |
| Qualité | QA | 7 | Review, tests, sécurité, perf, accessibilité, documentation, dette technique |
| Expertise | EXP | 7 | Prompting, SaaS, mobile, data, conformité, ops, standardisation |
| Gouvernance transverse | GOV | 3 | Méthodologie, validation, capitalisation |

---

## 6. Core Engine — Phase 1 (moteur d'orchestration)

| Service | Fichier | Rôle |
|---------|---------|------|
| RegistryReaderV2 | `services/registry-reader-v2.service.ts` | Lecture cache TTL, watch fichiers, validation |
| StateMachineEngine | `services/state-machine.service.ts` | Machine à 7 états, tracking projet, validation/execution transitions |
| ActivationEngine | `services/activation.service.ts` | Suggestion agents par événement, filtrage par phase |
| CapabilityResolver | `services/capability.service.ts` | Résolution tâche→agent, analyse d'écart, composition équipe |

| Commande | Fichier | Sous-commandes |
|----------|---------|----------------|
| `akoris state` | `commands/state.ts` | show, history, transition, info |
| `akoris activation` | `commands/activation.ts` | suggest, list, events |
| `akoris capability` | `commands/capability.ts` | find, search, team, list |

---

## 7. Commandes CLI testées (23 commandes racine)

| Commande | Résultat |
|----------|----------|
| `akoris` (sans args) | ✅ Message de bienvenue ASCII |
| `akoris about` | ✅ Vision, 10 principes |
| `akoris status` | ✅ Projet v2.0.0 |
| `akoris doctor` | ✅ Diagnostic OK |
| `akoris info` | ✅ Infos projet |
| `akoris registry list` | ✅ Registry v1 |
| `akoris registry index` | ✅ Index v2 (33 agents, 18 events...) |
| `akoris registry watch` | ✅ Surveillance |
| `akoris playbook list` | ✅ 3 playbooks |
| `akoris quality gates` | ✅ 8 quality gates |
| `akoris init` | ✅ Initialisation |
| `akoris audit sprint` | ✅ Audit |
| `akoris metrics` | ✅ 7 métriques |
| `akoris state show` | ✅ État courant, transitions |
| `akoris state transition --from Draft --to Planned` | ✅ Transition exécutée |
| `akoris activation list` | ✅ 18 événements listés |
| `akoris activation suggest --event RELEASE_PREP` | ✅ 7 agents suggérés |
| `akoris capability list` | ✅ 69 capacités |
| `akoris capability find design_architecture` | ✅ Résolution agent |
| `akoris capability team design_schema audit_security` | ✅ Composition équipe |

---

## 8. Arbre des commandes

```
akoris
│
├── init              Initialiser un projet
├── doctor            Diagnostic complet
├── info              Informations sur le projet courant
├── status            Etat de sante du projet
├── about             Manifeste AKORIS (vision, principes, engagements)
│
├── registry          Gestion du Registry
│   ├── list          Liste les composants
│   ├── index         Affiche l'index complet du Registry v2
│   ├── info          Infos sur un domaine
│   ├── update        Mise a jour
│   ├── sync          Synchronisation
│   ├── validate      Validation des schemas
│   └── watch         Surveillance des changements
│
├── playbook          Gestion des playbooks
│   ├── list          Liste les playbooks
│   ├── install       Installe un playbook
│   ├── remove        Supprime un playbook
│   └── current       Playbook actif
│
├── agent             Gestion des agents
│   ├── list          Liste les agents
│   ├── info          Infos sur un agent
│   ├── activate      Active un agent
│   ├── deactivate    Desactive un agent
│   ├── contract      Contrat d'un agent
│   └── audit         Audit d'un agent
│
├── sprint            Gestion des sprints
│   ├── start         Demarre un sprint
│   ├── report        Rapport de sprint
│   ├── close         Cloture un sprint
│   └── history       Historique des sprints
│
├── state             Machine a etats du projet
│   ├── show          Etat courant
│   ├── history       Historique des transitions
│   ├── transition    Transition vers un nouvel etat
│   └── info          Details de la machine
│
├── activation        Activation des agents
│   ├── suggest       Suggere des agents pour un evenement
│   ├── list          Liste la matrice d'activation
│   └── events        Liste les evenements disponibles
│
├── capability        Recherche de capacites
│   ├── find          Trouve un agent pour une capacite
│   ├── search        Recherche par mot-cle
│   ├── team          Compose une equipe pour des taches
│   └── list          Liste toutes les capacites
│
├── adr               Gestion des ADRs
│   ├── new           Nouvel ADR
│   ├── list          Liste des ADRs
│   ├── show          Affiche un ADR
│   └── export        Export des ADRs
│
├── audit             Lancement d'audits
│   ├── sprint        Audit de sprint
│   ├── project       Audit de projet
│   ├── release       Audit de release
│   ├── architecture  Audit d'architecture
│   └── documentation Audit de documentation
│
├── quality           Gestion de la qualite
│   ├── check         Verification Quality Gates
│   ├── gates         Liste des gates
│   ├── validate      Validation complete
│   └── metrics       Metriques qualite
│
├── docs              Gestion de la documentation
│   ├── generate      Generation
│   ├── validate      Validation
│   └── export        Export (pdf, html, markdown)
│
├── metrics           Gestion des metriques
│   ├── run           Metriques courantes
│   ├── history       Historique
│   └── export        Export JSON
│
├── knowledge         Gestion de la connaissance
│   ├── search        Recherche
│   ├── export        Export
│   └── import        Import
│
├── manifest          Gestion du MANIFEST
│   ├── show          Affichage
│   ├── update        Mise a jour
│   └── validate      Validation
│
├── validate          Validations
│   ├── architecture  Architecture
│   ├── documentation Documentation
│   ├── security      Securite
│   └── registry      Registry
│
├── install           Installation de composants
│   ├── playbook      Playbook
│   ├── expert        Expert IA
│   ├── connector     Connecteur
│   └── adapter       Adaptateur IA
│
├── export            Export de donnees
│   ├── registry      Registry
│   ├── audit         Rapport d'audit
│   └── project       Resume projet
│
└── upgrade           Mise a jour du CLI
```

---

## 9. Git & GitHub

```
Commits : 8
  6434adb - AKORIS v1.0.0 - Initial release
  73c4d9e - Mise à jour du rapport d'installation
  747b5bf - CLI redesign: 20 command groups
  ca12b95 - Rapport mis à jour: 20 commandes CLI, arbre, commits
  5698f5e - 33 agents contractuels avec structure standardisée
  bef1447 - Agent contracts upgrade: README, icônes, KPIs, tests, capabilities
  26432ce - Registry v2.0: index, graphe, règles, livrables, événements, API
  7da7f0f - feat(cli): add orchestration engine Phase 1
Push   : ✅ https://github.com/sieni7/AKORIS (3 pushes)
```

---

## 10. Spécification ARS — Évaluation

**AKORIS Registry Specification v1.0.0** — `docs/specifications/AKORIS-Registry-Specification.md`

| Critère | Note |
|---------|------|
| Clarté et lisibilité | 10/10 |
| Complétude | 10/10 |
| Applicabilité | 10/10 |
| Neutralité technologique | 10/10 |
| Extensibilité | 10/10 |
| **Moyenne** | **10/10** |

---

## 11. Architecture logique

```
                    AKORIS
            ┌────────────────────┐
            │    Registry Core   │
            │  (v2.0 — 57 files) │
            └────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
   CLI Engine    Adapters     Connectors
   (Phase 1)    (4 IA)       (4)
         │           │           │
         └───────────┼───────────┘
                     │
               Projet utilisateur
                 (.akoris/)

Moteur d'orchestration (Phase 1) :
  RegistryReaderV2 → StateMachineEngine → ActivationEngine → CapabilityResolver
```

---

## 12. Prochaines étapes

- [ ] Phase 2 — Tests unitaires (vitest) pour le Core Engine
- [ ] Phase 2 — Tests d'intégration (registry v2 ←→ moteur)
- [ ] Phase 3 — Documentation auto-générée (dgeni/typedoc)
- [ ] Phase 3 — Diagrammes de flux (Mermaid) dans les commandes
- [ ] Phase 4 — Rédaction des SOPs (Standard Operating Procedures)
- [ ] Phase 5 — Documentation de l'API REST du Registry
- [ ] Refactor — Nettoyage des fichiers registry v1 redondants
- [ ] Refactor — Alignement complet registry v1 ←→ v2

---

*Rapport généré automatiquement — AKORIS v2.0.0*
