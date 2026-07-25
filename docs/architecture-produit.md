# AKORIS — Architecture Produit

> Document définissant l'architecture technique de l'écosystème AKORIS, ses composants et leurs interfaces.

---

## 1. Architecture globale

AKORIS est composé de **huit couches indépendantes**, chacune avec une responsabilité unique et un versionnement autonome.

```text
                         AKORIS
       Méthode de gouvernance indépendante
──────────────────────────────────────────────────

              Constitution AKORIS
                      │
     ┌────────────────┼────────────────┐
     │                │                │
     ▼                ▼                ▼
  Registry         Policies        Workflows
     │                │                │
     └────────────┬───┴────────────────┘
                  ▼
              Templates
                  │
                  ▼
         Outillage (CLI, Adapters)
                  │
                  ▼
         Moteurs d'Intelligence Artificielle
(OpenCode • Cursor • Claude Code • Codex • Copilot…)
                  │
                  ▼
           Projets utilisateurs
```

---

## 2. Les 8 composants

### 2.1 `akoris-core`

Le référentiel officiel. Source unique de vérité de la méthode.

```
akoris-core/
├── constitution/
│   └── constitution.md
├── registry/
│   ├── agents/          → Définitions des agents (Core + Expert)
│   ├── policies/        → Politiques de qualité et sécurité
│   ├── quality-gates/   → Seuils et critères de validation
│   ├── checklists/      → Listes de vérification par phase
│   ├── templates/       → Gabarits de documents
│   ├── metrics/         → Définitions des métriques
│   ├── workflows/       → Modèles de cycles par type de projet
│   └── knowledge/       → Capitalisation (leçons, anti-patterns, FAQ)
├── rolebook/
│   ├── core/            → 8 fiches de mission Core
│   └── experts/         → 25 fiches de mission Expert
├── schemas/             → Schémas JSON de validation
├── docs/                → Documentation du Core
└── CHANGELOG.md
```

**Versionnement** : `methodVersion` dans le MANIFEST.

### 2.2 `akoris-cli`

Moteur d'exécution. Ne contient **aucune donnée de gouvernance**.

```
akoris-cli/
├── commands/
│   ├── init.ts          → Initialise .akoris/ + MANIFEST
│   ├── doctor.ts        → Diagnostic + --fix
│   ├── status.ts        → État de santé du projet
│   ├── audit.ts         → Lance un audit (sprint, project, release)
│   ├── quality.ts       → Quality Gates (check, list, validate)
│   ├── install.ts       → Installe playbook, expert, template
│   ├── registry.ts      → Gère le registry (update, info, sync)
│   ├── playbook.ts      → Gère les playbooks (list, install, current)
│   ├── validate.ts      → Valide architecture, documentation...
│   ├── metrics.ts       → Affiche/exporte les métriques
│   ├── knowledge.ts     → Recherche/exporte la connaissance
│   └── upgrade.ts       → Met à jour la méthode
├── services/
│   ├── registry.ts      → Lecture du registry local
│   ├── generator.ts     → Génération de documents
│   ├── validator.ts     → Validation des gates
│   └── renderer.ts      → Sortie formatée
├── generators/
├── validators/
└── utils/
```

**Versionnement** : `cliVersion` dans le MANIFEST.

### 2.3 `akoris-playbooks`

Modules indépendants par stack ou type de projet.

```
akoris-playbooks/
├── react-supabase/
├── nextjs/
├── laravel/
├── flutter/
├── spring-boot/
├── dotnet/
└── index.json           → Catalogue des playbooks disponibles
```

Chaque playbook contient :
```
react-supabase/
├── manifest.json        → Métadonnées du playbook
├── conventions.md       → Conventions spécifiques à la stack
├── stack.json           → Dépendances, versions, configs
├── providers/           → Connecteurs recommandés
│   ├── supabase/
│   ├── netlify/
│   └── github/
├── templates/           → Templates spécifiques à la stack
└── agents.json          → Agents recommandés pour cette stack
```

**Versionnement** : Indépendant, via npm ou registry.

### 2.4 `akoris-rolebook`

Catalogue des rôles et responsabilités des agents, en format neutre.

```
akoris-rolebook/
├── core/
│   ├── orchestrator.json
│   ├── product-owner.json
│   ├── architect.json
│   ├── tech-lead.json
│   ├── data-storage.json
│   ├── security-officer.json
│   ├── qa-auditor.json
│   └── agent-manager.json
└── experts/
    ├── react.json
    ├── nextjs.json
    ├── ...
```

### 2.5 `akoris-adapters`

Traduction des rôles et contrats AKORIS vers les formats spécifiques de chaque moteur IA.

```
akoris-adapters/
├── opencode/
│   ├── core/            → Contrats → OpenCode agents
│   └── experts/
├── cursor/
│   ├── rules/           → Contrats → Cursor rules
│   └── ...
├── claude-code/
│   ├── prompts/
│   └── ...
├── codex/
└── copilot/
```

### 2.6 `akoris-connectors`

Connecteurs vers les services externes.

```
akoris-connectors/
├── github/
├── gitlab/
├── supabase/
├── firebase/
├── vercel/
├── netlify/
├── jira/
├── linear/
└── notion/
```

### 2.7 `akoris-examples`

Projets de référence démontrant l'application de la méthode.

```
akoris-examples/
├── react-supabase/     → Projet complet avec .akoris/
├── laravel-api/
├── flutter-mobile/
└── index.md            → Guide de navigation
```

### 2.8 `user-projects`

Projets utilisateur. Chaque projet contient un dossier `.akoris/` comme copie de travail locale du registry.

```
mon-projet/
├── .akoris/
│   ├── MANIFEST.json
│   ├── README.md
│   ├── constitution/
│   ├── gouvernance/
│   │   └── contrats/
│   ├── decisions/
│   │   └── adr/
│   ├── backlog/
│   ├── sprints/
│   ├── audits/
│   ├── connaissances/
│   ├── metriques/
│   ├── playbooks/
│   ├── templates/
│   ├── registry/
│   │   ├── agents/
│   │   ├── policies/
│   │   ├── quality-gates/
│   │   ├── checklists/
│   │   ├── workflows/
│   │   └── knowledge/
│   ├── logs/            → Exclus du git
│   └── cache/           → Exclus du git
├── docs/
├── src/
└── ...
```

---

## 3. Le MANIFEST.json

Point d'entrée de tout projet AKORIS.

```json
{
  "method": "AKORIS",
  "methodVersion": "2.0.0",
  "cliVersion": "1.0.0",
  "registryVersion": "2.0.0",
  "playbook": "react-supabase",
  "workflow": "institutional-app",
  "executionEngine": "OpenCode",
  "project": "Racing Club de Bingerville",
  "projectType": "Institutional Website",
  "owner": "Siéni OULAÏ",
  "repository": "github.com/sieni7/racing",
  "createdAt": "2026-07-25",
  "updatedAt": "2026-07-25"
}
```

---

## 4. Versionnement

| Composant | Version | Dépend de |
|-----------|---------|-----------|
| AKORIS (méthode) | `methodVersion` | Rien |
| akoris-core | `registryVersion` | Rien |
| akoris-cli | `cliVersion` | Compatible avec la méthode |
| akoris-playbooks | Indépendant | Stack cible |
| akoris-rolebook | Lié au core | Registre des agents |
| akoris-adapters | Indépendant | Moteur IA cible |
| akoris-connectors | Indépendant | Service cible |

---

## 5. Principe d'inversion des dépendances

> **Le cœur d'AKORIS ne connaît rien des technologies, frameworks, fournisseurs ou moteurs IA.**

| Dans le Core | Hors du Core |
|---|---|
| Agent, Policy, Workflow | React, Laravel, Flutter |
| Template, Checklist, Gate | Supabase, Firebase, Stripe |
| Role, Contract | npm, Vite, Webpack |
| Metrics | OpenCode, Cursor, Claude |
| Knowledge, Convention | GitHub, Netlify, Jira |

---

## 6. Formats

- **Registry** : JSON (agents, policies, gates, metrics, workflows)
- **Templates** : Markdown (ADR, contrats, rapports)
- **Constitution** : Markdown
- **Checklists** : Markdown ou YAML
- **Policies** : Markdown
- **Logs** : JSON Lines (.jsonl)
- **Métriques** : JSON ou CSV
