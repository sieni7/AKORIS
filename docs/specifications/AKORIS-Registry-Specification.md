# AKORIS Registry Specification (ARS)

> **Version 1.0.0**
> Status: **Draft**
> Date: 2026-07-25
> Maintainer: AKORIS Core Team
> License: MIT

## Table des matières

1. [Introduction](#1-introduction)
2. [Conventions de nommage](#2-conventions-de-nommage)
3. [Structure du Registry](#3-structure-du-registry)
4. [Schémas JSON des ressources](#4-schémas-json-des-ressources)
5. [Relations entre les objets](#5-relations-entre-les-objets)
6. [Règles de versionnement](#6-règles-de-versionnement)
7. [Compatibilité et rétrocompatibilité](#7-compatibilité-et-rétrocompatibilité)
8. [Extension et personnalisation](#8-extension-et-personnalisation)
9. [Index des chemins normalisés](#9-index-des-chemins-normalisés)
10. [Annexes](#10-annexes)

---

## 1. Introduction

### 1.1 Objectif

Ce document définit la spécification officielle du Registry AKORIS, le référentiel central de gouvernance pour le développement logiciel assisté par IA. Il établit les normes, formats et conventions que tous les composants d'AKORIS (CLI, adaptateurs, connecteurs, interfaces) doivent respecter pour garantir l'interopérabilité, la traçabilité et la reproductibilité des processus de développement.

Le Registry AKORIS constitue le cœur du standard : il décrit, organise et valide l'ensemble des artefacts, agents, règles et flux qui composent un projet logiciel gouverné par AKORIS.

### 1.2 Portée

Cette spécification couvre l'intégralité du périmètre fonctionnel du Registry :

- **La structure et l'organisation** du référentiel de fichiers et répertoires
- **Les schémas JSON** de chaque type de ressource (agents, règles, livrables, événements, workflows, politiques, quality gates)
- **Les conventions de nommage et d'identification** des ressources
- **Les relations** entre les objets du référentiel (dépendances, déclenchements, productions)
- **Les règles de versionnement** et de gestion des évolutions
- **Les garanties de rétrocompatibilité** entre versions du Registry et des outils clients
- **Les mécanismes d'extension** pour la personnalisation par projets ou organisations

### 1.3 Principes fondamentaux

Le Registry AKORIS repose sur cinq principes fondamentaux qui guident toute décision de conception et d'évolution :

1. **Le Registry est la source de vérité unique** — Toute information de gouvernance, qu'elle concerne un agent, une règle, un livrable ou un workflow, réside exclusivement dans le Registry. Aucune information dupliquée ou dérivée ne fait autorité.

2. **Les contrats sont exécutables** — Chaque ressource possède une représentation machine (JSON) exploitable directement par les outils CLI, les adaptateurs et les vérificateurs. La spécification est conçue pour être lue et interprétée par des programmes.

3. **L'ontologie est partagée** — Tous les composants de l'écosystème AKORIS utilisent le même vocabulaire défini dans l'ontologie formelle (`ontology.json`). Cette ontologie garantit la cohérence sémantique entre les domaines, les phases, les rôles et les artefacts.

4. **L'évolution est versionnée** — Toute modification du Registry suit strictement les règles du versionnement sémantique (SemVer 2.0.0). Les changements majeurs, mineurs et correctifs sont identifiés, documentés et communiqués via le CHANGELOG.

5. **L'extensibilité est garantie** — Le Registry peut être étendu par des domaines personnalisés, des agents tiers ou des playbooks additionnels sans jamais casser les contrats existants. La rétrocompatibilité est une exigence non négociable.

### 1.4 Structure du document

Ce document est organisé en dix sections principales. Les sections 2 à 4 définissent la syntaxe et la sémantique des ressources. Les sections 5 à 7 décrivent les relations et les règles d'évolution. Les sections 8 à 10 couvrent l'extensibilité, l'index des chemins et les annexes.

---

## 2. Conventions de nommage

Les conventions de nommage définissent les règles d'identification, de structuration et de formatage applicables à toutes les ressources du Registry AKORIS. Le respect strict de ces conventions est obligatoire pour garantir l'interopérabilité entre les outils et les projets.

### 2.1 Identifiants de ressources

Toute ressource au sein du Registry possède un identifiant unique et immuable. Une fois assigné, un identifiant ne peut plus être modifié, réaffecté ou réutilisé, même si la ressource est supprimée ou dépréciée.

#### 2.1.1 Agents

Les agents sont identifiés selon le format suivant :

```
{DOMAINE}-{NN}-{Slug}
```

Où :
- `{DOMAINE}` est le préfixe de domaine en majuscules (CORE, DEV, QA, EXP, GOV)
- `{NN}` est un numéro séquentiel à deux chiffres (01 à 99)
- `{Slug}` est un nom court en anglais, en PascalCase, décrivant le rôle de l'agent

Exemples :

| ID | Rôle |
|----|------|
| `CORE-01-Orchestrator` | Agent coordinateur principal |
| `CORE-02-Solution-Architect` | Architecture technique globale |
| `DEV-01-Product-Owner` | Définition et priorisation du backlog |
| `DEV-05-Backend-Developer` | Implémentation backend |
| `QA-03-Automation-Engineer` | Automatisation des tests |
| `QA-07-Security-Auditor` | Audit de sécurité |
| `EXP-02-Prompt-Engineer` | Ingénierie des prompts |
| `GOV-03-Risk-Manager` | Gestion des risques |

#### 2.1.2 Autres ressources

Les règles, livrables, événements, workflows, politiques et quality gates suivent un format à préfixe alphabétique et numéro séquentiel :

```
{PREFIXE}-{NNN}
```

Où :
- `{PREFIXE}` est un préfixe en majuscules de 3 à 6 lettres identifiant le type de ressource
- `{NNN}` est un numéro séquentiel à trois chiffres (001 à 999)

PREFIXES normalisés :

| Type | Préfixe | Exemple |
|------|---------|---------|
| Règle | `RULE` | `RULE-042` |
| Livrable | `DEL` | `DEL-013` |
| Événement | `EVT` | `EVT-007` |
| Workflow | `WRK` | `WRK-021` |
| Politique | `POL` | `POL-005` |
| Quality Gate | `QG` | `QG-018` |
| Métrique | `MET` | `MET-034` |
| Checklist | `CHK` | `CHK-011` |
| Template | `TPL` | `TPL-008` |
| Connexion | `CONN` | `CONN-003` |
| Transition d'état | `TRN` | `TRN-006` |
| Playbook | `PLB` | `PLB-004` |

### 2.2 Nommage des fichiers et répertoires

Tous les fichiers et répertoires du Registry respectent les règles suivantes :

- **Cas** : kebab-case exclusivement (lettres minuscules, traits d'union entre les mots)
- **Extensions** : `.json` pour les données structurées, `.md` pour la documentation, `.schema.json` pour les schémas JSON
- **Fichier index** : chaque répertoire d'agent contient obligatoirement un fichier `agent.json`
- **Fichier README** : chaque répertoire peut contenir un `README.md` facultatif

Exemples de chemins valides :

```
registry/agents/CORE-01-Orchestrator/agent.json
registry/rules/RULE-042.json
registry/deliverables/DEL-013.json
registry/events/EVT-007.json
registry/workflows/WRK-021.json
```

### 2.3 Versions

Le versionnement suit le standard **SemVer 2.0.0** avec le format `MAJEUR.MINEUR.CORRECTIF` :

- **MAJEUR** : changement incompatible (ajout/suppression de champs obligatoires, modification de structure)
- **MINEUR** : ajout compatible ascendante (nouveau champ optionnel, nouvelle ressource)
- **CORRECTIF** : correction de documentation, faute de frappe, métadonnées

Exemples : `1.0.0`, `1.3.2`, `2.0.0-alpha.1`

### 2.4 Dates

Toutes les dates au sein du Registry utilisent le format **ISO 8601** étendu : `YYYY-MM-DD`.

Exemples : `2026-07-25`, `2026-01-01`

Les dates avec heure utilisent le format complet : `YYYY-MM-DDThh:mm:ssZ` (temps universel coordonné).

### 2.5 Langue

- **Contenu lisible par un humain** (descriptions, titres, commentaires, README, CHANGELOG) : **français**
- **Clés JSON, identifiants, slugs, noms de champs** : **anglais** (conventions JSON et programmation)
- **Messages d'erreur, logs, sorties CLI** : **français** (cohérence avec la langue officielle du standard)
- **Documentation technique** (celle-ci) : **français**

Cette règle garantit que les schémas restent interopérables avec les outils de développement mondiaux tout en maintenant une documentation accessible aux utilisateurs francophones.

---

## 3. Structure du Registry

Le Registry AKORIS est organisé selon une arborescence de fichiers et répertoires strictement normalisée. Chaque répertoire et chaque fichier a un rôle défini et un contenu attendu.

### 3.1 Arborescence complète

```
registry/
├── registry.json                       # Index global du Registry (fichier racine)
├── dependency-graph.json                # Graphe des dépendances entre agents
├── activation-matrix.json              # Matrice de déclenchement événements → agents
├── capabilities.json                   # Index global des capacités offertes
├── ontology.json                       # Ontologie formelle partagée
├── state-machine.json                  # Machine à états du cycle de vie projet
├── CHANGELOG.md                        # Historique des modifications du Registry
│
├── agents/                             # Contrats des 33 agents AKORIS
│   ├── CORE-01-Orchestrator/
│   │   ├── agent.json                  # Contrat de l'agent
│   │   ├── README.md                   # Documentation
│   │   └── prompts/                    # Prompts système associés
│   │       ├── init.md
│   │       └── execute.md
│   ├── CORE-02-Solution-Architect/
│   ├── DEV-01-Product-Owner/
│   ├── DEV-02-Scrum-Master/
│   ├── DEV-03-Tech-Lead/
│   ├── DEV-04-Frontend-Developer/
│   ├── DEV-05-Backend-Developer/
│   ├── DEV-06-Fullstack-Developer/
│   ├── DEV-07-Database-Administrator/
│   ├── DEV-08-DevOps-Engineer/
│   ├── DEV-09-Mobile-Developer/
│   ├── QA-01-Test-Analyst/
│   ├── QA-02-Test-Automation-Engineer/
│   ├── QA-03-Performance-Tester/
│   ├── QA-04-Security-Tester/
│   ├── QA-05-Accessibility-Tester/
│   ├── QA-06-Usability-Tester/
│   ├── QA-07-Compliance-Auditor/
│   ├── QA-08-Code-Reviewer/
│   ├── EXP-01-Data-Scientist/
│   ├── EXP-02-Prompt-Engineer/
│   ├── EXP-03-AI-Safety-Officer/
│   ├── EXP-04-AI-Ethics-Officer/
│   ├── EXP-05-ML-Engineer/
│   ├── EXP-06-Knowledge-Engineer/
│   ├── EXP-07-AI-Architect/
│   ├── GOV-01-Project-Manager/
│   ├── GOV-02-Risk-Manager/
│   ├── GOV-03-Compliance-Officer/
│   ├── GOV-04-Auditor/
│   ├── GOV-05-Archivist/
│   ├── GOV-06-Stakeholder-Reporter/
│   └── GOV-07-Change-Manager/
│
├── rules/                              # Définitions des règles (RULE-001 à RULE-NNN)
│   ├── RULE-001.json
│   ├── RULE-002.json
│   └── ...
│
├── deliverables/                       # Contrats de livrables (DEL-001 à DEL-NNN)
│   ├── DEL-001.json
│   ├── DEL-002.json
│   └── ...
│
├── events/                             # Définitions des événements (EVT-001 à EVT-NNN)
│   ├── EVT-001.json
│   ├── EVT-002.json
│   └── ...
│
├── policies/                           # Politiques de gouvernance (POL-001 à POL-NNN)
│   ├── POL-001.json
│   ├── POL-002.json
│   └── ...
│
├── workflows/                          # Définitions des workflows (WRK-001 à WRK-NNN)
│   ├── WRK-001.json
│   ├── WRK-002.json
│   └── ...
│
├── quality-gates/                      # Quality Gates (QG-001 à QG-NNN)
│   ├── QG-001.json
│   ├── QG-002.json
│   └── ...
│
├── templates/                          # Templates de livrables (TPL-001 à TPL-NNN)
│   ├── TPL-001.json
│   ├── TPL-002.json
│   └── ...
│
├── checklists/                         # Définitions de checklists (CHK-001 à CHK-NNN)
│   ├── CHK-001.json
│   ├── CHK-002.json
│   └── ...
│
├── contracts/                          # Modèles de contrats juridiques et techniques
│   ├── SLA-template.json
│   ├── DPA-template.json
│   └── ...
│
├── metrics/                            # Définitions de métriques (MET-001 à MET-NNN)
│   ├── MET-001.json
│   ├── MET-002.json
│   └── ...
│
├── conventions/                        # Conventions de codage et documentation
│   ├── coding-conventions.json
│   ├── commit-conventions.json
│   └── documentation-conventions.json
│
├── schemas/                            # Schémas JSON Schema de validation
│   ├── agent.schema.json
│   ├── rule.schema.json
│   ├── deliverable.schema.json
│   ├── event.schema.json
│   ├── workflow.schema.json
│   ├── policy.schema.json
│   ├── quality-gate.schema.json
│   └── registry.schema.json
│
├── glossary/                           # Glossaire du domaine
│   ├── glossary.json
│   └── README.md
│
├── playbooks/                          # Playbooks par pile technologique
│   ├── web-app.json
│   ├── mobile-app.json
│   ├── data-pipeline.json
│   ├── cloud-infrastructure.json
│   ├── api-service.json
│   └── README.md
│
└── examples/                           # Exemples d'utilisation
    ├── example-project.json
    └── README.md
```

### 3.2 Fichier racine : registry.json

Le fichier `registry.json` est le point d'entrée obligatoire. Il contient les métadonnées d'identification et la liste de toutes les ressources indexées.

```json
{
  "$schema": "./schemas/registry.schema.json",
  "id": "akoris-registry",
  "name": "Registry AKORIS",
  "version": "1.0.0",
  "description": "Référentiel central de gouvernance AKORIS",
  "maintainer": "AKORIS Core Team",
  "license": "MIT",
  "createdAt": "2026-07-25",
  "updatedAt": "2026-07-25",
  "agentCount": 33,
  "ruleCount": 150,
  "deliverableCount": 45,
  "eventCount": 25,
  "workflowCount": 12,
  "policyCount": 18,
  "qualityGateCount": 30,
  "compatibleCLIVersions": ["^1.0.0"],
  "ontologyVersion": "1.0.0",
  "stateMachineVersion": "1.0.0"
}
```

### 3.3 Fichier de dépendances : dependency-graph.json

```json
{
  "$schema": "./schemas/dependency-graph.schema.json",
  "version": "1.0.0",
  "dependencies": [
    {
      "source": "CORE-01-Orchestrator",
      "target": "CORE-02-Solution-Architect",
      "type": "mandatory"
    },
    {
      "source": "CORE-01-Orchestrator",
      "target": "DEV-01-Product-Owner",
      "type": "mandatory"
    }
  ]
}
```

### 3.4 Fichier d'activation : activation-matrix.json

```json
{
  "$schema": "./schemas/activation-matrix.schema.json",
  "version": "1.0.0",
  "activations": [
    {
      "event": "EVT-001",
      "eventName": "project.initialized",
      "activatedAgents": ["CORE-01-Orchestrator", "GOV-01-Project-Manager"],
      "mode": "sequential"
    }
  ]
}
```

---

## 4. Schémas JSON des ressources

Cette section définit les schémas JSON normalisés pour chaque type de ressource du Registry. Tous les fichiers JSON doivent respecter ces schémas. Les schémas formels complets (au format JSON Schema Draft 2020-12) résident dans le répertoire `registry/schemas/`.

### 4.1 Agent

Un agent représente un rôle logiciel autonome participant au processus de développement. Chaque agent est défini par un contrat formel.

**Fichier** : `registry/agents/{AGENT-ID}/agent.json`

```json
{
  "$schema": "../../schemas/agent.schema.json",
  "id": "CORE-01-Orchestrator",
  "name": "Orchestrateur",
  "version": "1.0.0",
  "domain": "CORE",
  "criticity": "critique",
  "status": "active",
  "description": "Agent coordinateur principal responsable de l'activation et de la coordination des autres agents AKORIS.",
  "tags": ["core", "coordination", "orchestration"],
  "dependencies": [
    {
      "agentId": "CORE-02-Solution-Architect",
      "type": "mandatory",
      "description": "Nécessite l'architecture technique pour planifier les tâches"
    }
  ],
  "tokenEstimate": 4096,
  "modelCapabilities": ["chat", "code-generation", "reasoning"],
  "kpis": [
    {
      "id": "MET-001",
      "name": "taux-completion-taches",
      "target": 0.95,
      "weight": 0.4
    }
  ],
  "activatedBy": ["EVT-001", "EVT-005"],
  "produces": ["DEL-001", "DEL-002"],
  "consumes": ["DEL-003", "DEL-004"],
  "validatedBy": ["QG-001", "QG-002"],
  "prompts": {
    "init": "./prompts/init.md",
    "execute": "./prompts/execute.md"
  }
}
```

**Propriétés obligatoires** : `id`, `name`, `version`, `domain`, `criticity`, `status`, `description`, `dependencies`, `activatedBy`, `validatedBy`

**Propriétés optionnelles** : `tags`, `tokenEstimate`, `modelCapabilities`, `kpis`, `produces`, `consumes`, `prompts`

**Valeurs admises pour `criticity`** : `"critique"`, `"élevée"`, `"moyenne"`, `"basse"`

**Valeurs admises pour `status`** : `"active"`, `"inactive"`, `"deprecated"`, `"draft"`

**Valeurs admises pour `domain`** : `"CORE"`, `"DEV"`, `"QA"`, `"EXP"`, `"GOV"` (ou domaine personnalisé)

### 4.2 Règle (Rule)

Une règle définit une condition exécutable de gouvernance, avec une conséquence en cas de violation.

**Fichier** : `registry/rules/RULE-NNN.json`

```json
{
  "$schema": "../schemas/rule.schema.json",
  "id": "RULE-042",
  "name": "Validation obligatoire des livrables",
  "version": "1.0.0",
  "description": "Tout livrable produit par un agent doit être validé par au moins un Quality Gate avant d'être marqué comme 'approuvé'.",
  "severity": "bloquante",
  "scope": "all-agents",
  "if": {
    "condition": "deliverable.status == 'completed' AND deliverable.qualityGates.length == 0"
  },
  "then": [
    {
      "action": "block",
      "message": "Le livrable {{deliverable.id}} doit passer au moins un Quality Gate avant validation finale."
    },
    {
      "action": "notify",
      "target": "CORE-01-Orchestrator"
    }
  ],
  "otherwise": [],
  "source": "AKORIS Core Team",
  "tags": ["validation", "quality-gate", "gouvernance"],
  "references": ["POL-003"],
  "enforces": ["CORE-01-Orchestrator", "DEV-03-Tech-Lead"]
}
```

**Valeurs admises pour `severity`** : `"bloquante"`, `"critique"`, `"majeure"`, `"mineure"`, `"information"`

### 4.3 Livrable (Deliverable)

Un livrable est un artefact produit ou consommé par un ou plusieurs agents au cours du cycle de vie du projet.

**Fichier** : `registry/deliverables/DEL-NNN.json`

```json
{
  "$schema": "../schemas/deliverable.schema.json",
  "id": "DEL-013",
  "name": "Document d'Architecture Technique",
  "version": "1.0.0",
  "type": "documentation",
  "description": "Document décrivant l'architecture technique complète du projet, incluant les choix technologiques, les diagrammes de composants et les décisions d'architecture.",
  "formats": ["markdown", "pdf", "adoc"],
  "mandatory": true,
  "producedBy": ["CORE-02-Solution-Architect"],
  "consumedBy": ["DEV-03-Tech-Lead", "DEV-04-Frontend-Developer", "DEV-05-Backend-Developer"],
  "qualityGates": ["QG-003", "QG-007"],
  "template": "TPL-002",
  "tags": ["architecture", "technique", "documentation"]
}
```

**Valeurs admises pour `type`** : `"documentation"`, `"code"`, `"configuration"`, `"rapport"`, `"plan"`, `"specification"`, `"modele"`, `"analyse"`, `"audit"`

### 4.4 Événement (Event)

Un événement est un signal déclencheur dans le cycle de vie du projet, pouvant activer des agents ou lancer des workflows.

**Fichier** : `registry/events/EVT-NNN.json`

```json
{
  "$schema": "../schemas/event.schema.json",
  "id": "EVT-007",
  "name": "Nouveau sprint démarré",
  "version": "1.0.0",
  "description": "Événement déclenché lorsqu'un nouveau sprint est officiellement démarré dans l'outil de gestion de projet.",
  "phase": "execution",
  "triggers": ["WRK-003", "WRK-005"],
  "producedBy": ["DEV-02-Scrum-Master"],
  "consumedBy": ["CORE-01-Orchestrator", "DEV-01-Product-Owner"],
  "payload": {
    "type": "object",
    "properties": {
      "sprintId": { "type": "string" },
      "startDate": { "type": "string", "format": "date" },
      "endDate": { "type": "string", "format": "date" },
      "objectives": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["sprintId", "startDate", "endDate"]
  },
  "tags": ["sprint", "agile", "cycle-de-vie"]
}
```

**Valeurs admises pour `phase`** : `"initialisation"`, `"planification"`, `"execution"`, `"validation"`, `"livraison"`, `"retrospective"`, `"archivage"`

### 4.5 Workflow

Un workflow est une séquence d'étapes exécutées par des agents en réponse à un ou plusieurs événements.

**Fichier** : `registry/workflows/WRK-NNN.json`

```json
{
  "$schema": "../schemas/workflow.schema.json",
  "id": "WRK-021",
  "name": "Processus de revue de code",
  "version": "1.0.0",
  "description": "Workflow automatisé de revue de code déclenché à la soumission d'une pull request, impliquant l'analyse statique, la revue humaine et les vérifications de conformité.",
  "triggers": ["EVT-012"],
  "steps": [
    {
      "order": 1,
      "name": "Analyse statique automatique",
      "executedBy": "QA-08-Code-Reviewer",
      "inputs": ["DEL-021"],
      "outputs": ["DEL-022"],
      "condition": null,
      "timeout": 300
    },
    {
      "order": 2,
      "name": "Revue de conformité",
      "executedBy": "QA-07-Compliance-Auditor",
      "inputs": ["DEL-021", "DEL-022"],
      "outputs": ["DEL-023"],
      "condition": "steps[0].outputs.status == 'passed'",
      "timeout": 600
    },
    {
      "order": 3,
      "name": "Approbation finale",
      "executedBy": "DEV-03-Tech-Lead",
      "inputs": ["DEL-023"],
      "outputs": ["DEL-024"],
      "condition": "steps[1].outputs.status == 'approved'",
      "timeout": 3600
    }
  ],
  "agents": ["QA-08-Code-Reviewer", "QA-07-Compliance-Auditor", "DEV-03-Tech-Lead"],
  "mode": "sequential",
  "tags": ["code-review", "qualite", "automatisation"]
}
```

**Valeurs admises pour `mode`** : `"sequential"`, `"parallel"`, `"hybrid"`

### 4.6 Politique (Policy)

Une politique définit une règle de gouvernance organisationnelle qui s'impose à tous les projets utilisant le Registry.

**Fichier** : `registry/policies/POL-NNN.json`

```json
{
  "$schema": "../schemas/policy.schema.json",
  "id": "POL-005",
  "name": "Politique de sécurité des livrables",
  "version": "1.0.0",
  "domain": "QA",
  "description": "Tout livrable contenant du code exécutable doit subir un scan de vulnérabilités avant d'être intégré à la branche principale.",
  "mandatory": true,
  "appliesTo": ["DEL-014", "DEL-015", "DEL-021", "DEL-030"],
  "rules": ["RULE-078", "RULE-081"],
  "tags": ["securite", "vulnerabilite", "conformite"]
}
```

### 4.7 Quality Gate (QG)

Un Quality Gate est un point de contrôle validant qu'un livrable, une transition ou un artefact respecte des critères prédéfinis avant de passer à l'étape suivante.

**Fichier** : `registry/quality-gates/QG-NNN.json`

```json
{
  "$schema": "../schemas/quality-gate.schema.json",
  "id": "QG-018",
  "name": "Gate de complétude documentaire",
  "version": "1.0.0",
  "description": "Vérifie qu'un livrable de type documentation contient tous les champs obligatoires et respecte le template associé.",
  "severity": "bloquante",
  "owner": "QA-01-Test-Analyst",
  "criteria": [
    {
      "id": "CRIT-001",
      "name": "Existence du document",
      "description": "Le fichier livrable doit exister au chemin attendu",
      "evaluator": "file_exists",
      "params": { "path": "{{deliverable.path}}" },
      "weight": 0.3
    },
    {
      "id": "CRIT-002",
      "name": "Conformité au template",
      "description": "La structure du document doit correspondre au template référencé",
      "evaluator": "template_match",
      "params": { "templateId": "{{deliverable.template}}" },
      "weight": 0.4
    },
    {
      "id": "CRIT-003",
      "name": "Validation sémantique",
      "description": "Le contenu du document passe l'analyse sémantique",
      "evaluator": "semantic_analysis",
      "params": { "minScore": 0.8 },
      "weight": 0.3
    }
  ],
  "threshold": 0.8,
  "controls": ["TRN-003", "TRN-007"],
  "tags": ["documentation", "qualite", "validation"]
}
```

### 4.8 Métrique (Metric)

Une métrique définit un indicateur quantifiable utilisé pour évaluer la performance des agents ou la qualité des livrables.

**Fichier** : `registry/metrics/MET-NNN.json`

```json
{
  "$schema": "../schemas/metric.schema.json",
  "id": "MET-034",
  "name": "Taux de couverture des tests",
  "version": "1.0.0",
  "description": "Pourcentage du code couvert par les tests automatisés, calculé sur l'ensemble du codebase.",
  "unit": "pourcentage",
  "range": { "min": 0, "max": 100 },
  "target": 85,
  "thresholds": {
    "critical": 60,
    "warning": 75,
    "success": 85
  },
  "evaluationMethod": "automated",
  "source": "QA-02-Test-Automation-Engineer",
  "tags": ["test", "couverture", "qualite"]
}
```

### 4.9 Checklist

Une checklist est une liste structurée de points de vérification applicables à un contexte donné (livraison, déploiement, sprint).

**Fichier** : `registry/checklists/CHK-NNN.json`

```json
{
  "$schema": "../schemas/checklist.schema.json",
  "id": "CHK-011",
  "name": "Liste de vérification de mise en production",
  "version": "1.0.0",
  "description": "Points de contrôle obligatoires avant toute mise en production d'une nouvelle version.",
  "context": "deploiement",
  "items": [
    {
      "id": "ITEM-001",
      "description": "Tous les tests unitaires passent avec un taux de succès ≥ 95 %",
      "mandatory": true,
      "assignedTo": "QA-02-Test-Automation-Engineer",
      "evidence": "rapport-de-test"
    },
    {
      "id": "ITEM-002",
      "description": "Le scan de sécurité n'a remonté aucune vulnérabilité critique",
      "mandatory": true,
      "assignedTo": "QA-04-Security-Tester",
      "evidence": "rapport-de-securite"
    },
    {
      "id": "ITEM-003",
      "description": "La documentation de déploiement est à jour",
      "mandatory": false,
      "assignedTo": "DEV-08-DevOps-Engineer"
    }
  ],
  "tags": ["deploiement", "production", "qualite"]
}
```

---

## 5. Relations entre les objets

Les ressources du Registry ne vivent pas en isolation. Elles forment un graphe de relations typées qui constitue le cœur de la gouvernance AKORIS. Cette section décrit l'ensemble des relations normalisées entre les types d'objets.

### 5.1 Tableau des relations

| Source | Relation | Cible | Cardinalité | Description |
|--------|----------|-------|-------------|-------------|
| Agent | `dependsOn` | Agent | 0..* | Dépendance fonctionnelle obligatoire ou optionnelle |
| Agent | `produces` | Deliverable | 0..* | L'agent produit un livrable en sortie |
| Agent | `consumes` | Deliverable | 0..* | L'agent consomme un livrable en entrée |
| Agent | `validatedBy` | QualityGate | 1..* | L'agent est soumis à des Quality Gates |
| Agent | `activatedBy` | Event | 1..* | L'agent est activé par des événements |
| Agent | `governedBy` | Rule | 0..* | L'agent est soumis à des règles |
| Event | `triggers` | Workflow | 0..* | L'événement déclenche un ou plusieurs workflows |
| Event | `triggers` | Agent | 0..* | L'événement active directement un agent |
| Workflow | `executedBy` | Agent | 1..* | Le workflow est exécuté par des agents |
| Workflow | `produces` | Deliverable | 0..* | Le workflow produit des livrables |
| Workflow | `consumes` | Deliverable | 0..* | Le workflow consomme des livrables |
| Rule | `enforces` | Agent | 0..* | La règle s'applique à des agents |
| Rule | `references` | Policy | 0..* | La règle se réfère à une politique |
| Deliverable | `validatedBy` | QualityGate | 0..* | Le livrable est validé par des Quality Gates |
| Deliverable | `follows` | Template | 0..1 | Le livrable suit un template |
| QualityGate | `controls` | Transition | 1..* | Le Quality Gate contrôle des transitions d'état |
| Transition | `authorizedBy` | Agent | 1..* | La transition est autorisée par des agents |
| Policy | `appliesTo` | Deliverable | 0..* | La politique s'applique à des livrables |
| Policy | `appliesTo` | Agent | 0..* | La politique s'applique à des agents |
| Metric | `evaluates` | Agent | 0..1 | La métrique évalue la performance d'un agent |
| Metric | `evaluates` | Deliverable | 0..1 | La métrique évalue la qualité d'un livrable |

### 5.2 Graphe relationnel simplifié

Le graphe ci-dessous illustre les relations principales entre les types fondamentaux du Registry :

```
Event ──triggers──▶ Workflow ──executedBy──▶ Agent
  │                                              │
  │                                              ├──produces──▶ Deliverable
  │                                              │                   │
  │                                              │                   ▼
  │                                              │            QualityGate
  │                                              │                   │
  │                                              │                   ▼
  │                                              └──validatedBy──▶ Transition
  │
  └──activatedBy──▶ Agent ──governedBy──▶ Rule ──references──▶ Policy
```

### 5.3 Contraintes d'intégrité

Les contraintes suivantes sont vérifiées à chaque validation du Registry :

1. **Intégrité référentielle** : toute référence à un ID de ressource (agent, règle, livrable, etc.) doit correspondre à une ressource existante dans le Registry.
2. **Non-circularité des dépendances** : le graphe des dépendances entre agents (`dependsOn`) ne doit pas contenir de cycle.
3. **Couverture des Quality Gates** : tout agent doit être associé à au moins un Quality Gate via `validatedBy`.
4. **Tragabilité des événements** : tout événement déclencheur (`triggers`) doit pointer vers un workflow ou un agent existant.
5. **Cohérence des phases** : un événement déclenché dans une phase du cycle de vie ne peut référencer que des workflows ou agents actifs dans cette même phase.
6. **Unicité des identifiants** : aucun ID ne peut être dupliqué, quel que soit le type de ressource.

---

## 6. Règles de versionnement

Le versionnement du Registry AKORIS suit des règles strictes permettant une évolution contrôlée et prévisible de la spécification et des contrats.

### 6.1 Versionnement du Registry

Le fichier `registry/registry.json` porte une version globale qui évolue selon les règles du versionnement sémantique (SemVer 2.0.0) :

| Incrément | Condition | Exemple |
|-----------|-----------|---------|
| **MAJEUR** | Suppression ou renommage d'un champ obligatoire dans un schéma ; modification de la structure d'un fichier racine ; changement incompatible de l'ontologie ; retrait d'une ressource du Registry de base | `1.0.0` → `2.0.0` |
| **MINEUR** | Ajout d'une nouvelle ressource ; ajout d'un champ optionnel à un schéma existant ; ajout d'un nouvel agent ; nouvelle règle ou politique | `1.0.0` → `1.1.0` |
| **CORRECTIF** | Correction d'une erreur de documentation ; mise à jour des métadonnées ; correction d'une faute d'orthographe ; ajustement des valeurs par défaut | `1.0.0` → `1.0.1` |

### 6.2 Versionnement des agents

Chaque agent possède sa propre version, indépendante de la version globale du Registry. Le fichier `agent.json` de chaque agent inclut un champ `version` SemVer. Un agent peut évoluer à son propre rythme, à condition de respecter les contrats d'interface avec les autres agents.

**Règles :**
- Un agent peut être mis à jour sans incrémenter la version du Registry
- La version d'un agent évolue de manière indépendante
- Les dépendances entre agents peuvent spécifier des contraintes de version (ex: `"^1.2.0"`)
- Le champ `compatibleCLIVersions` dans `registry.json` définit la fourchette de versions CLI compatibles

### 6.3 Versionnement du manifeste projet

Le fichier `.akoris/manifest.json` d'un projet AKORIS contient une propriété `akorisVersion` qui référence la version du Registry avec laquelle le projet est compatible.

```json
{
  "projectName": "MonProjet",
  "akorisVersion": "^1.0.0",
  "agents": ["CORE-01", "DEV-03", "QA-05"]
}
```

### 6.4 Matrice de compatibilité

La matrice de compatibilité garantit que les outils clients peuvent fonctionner avec différentes versions du Registry :

| Version Registry | CLI v1.0.x | CLI v1.1.x | CLI v2.0.x |
|------------------|-----------|-----------|-----------|
| 1.0.x | ✅ Compatible | ✅ Compatible | ⚠️ Partielle |
| 1.1.x | ✅ Compatible | ✅ Compatible | ✅ Compatible |
| 2.0.x | ⚠️ Champs ignorés | ✅ Compatible | ✅ Compatible |

**Principe :** Une version majeure du CLI est compatible avec la version majeure correspondante du Registry et la version majeure suivante (sous réserve que les nouveaux champs soient ignorés).

### 6.5 Journal des modifications (CHANGELOG)

Toute modification du Registry doit être documentée dans le fichier `CHANGELOG.md` situé à la racine du répertoire `registry/`. Le format suit les recommandations de [Keep a Changelog](https://keepachangelog.com/).

```markdown
# Changelog du Registry AKORIS

## [1.1.0] - 2026-08-15
### Ajouté
- Nouvel agent : EXP-07-AI-Architect
- Nouvelle métrique : MET-034 (Taux de couverture des tests)
### Modifié
- Mise à jour du schéma Agent : ajout du champ optionnel `modelCapabilities`

## [1.0.1] - 2026-07-28
### Corrigé
- Correction de fautes d'orthographe dans les descriptions des agents QA

## [1.0.0] - 2026-07-25
### Ajouté
- Version initiale du Registry AKORIS
- 33 agents, 150 règles, 45 livrables, 25 événements, 12 workflows
```

### 6.6 Règles de transition entre versions

1. Durant une période de transition (minimum 2 versions mineures), les fichiers dépréciés doivent rester présents dans le Registry.
2. Un champ `deprecated` dans la section des propriétés d'une ressource indique qu'elle sera supprimée dans une version majeure ultérieure.
3. Les outils clients doivent afficher un avertissement lorsqu'ils rencontrent une ressource ou propriété marquée comme dépréciée.
4. La version majeure du Registry ne peut être incrémentée qu'après un préavis d'au moins 90 jours publié dans le CHANGELOG.

---

## 7. Compatibilité et rétrocompatibilité

Le Registry AKORIS s'engage à maintenir la rétrocompatibilité entre versions majeures consécutives selon les règles détaillées ci-dessous.

### 7.1 Évolution des schémas JSON

L'évolution des schémas JSON est strictement encadrée pour ne jamais casser les outils clients existants.

**Règles d'ajout de propriétés :**

| Action | Compatible ? | Exemple |
|--------|-------------|---------|
| Ajouter une propriété optionnelle | ✅ Oui | Ajout de `modelCapabilities` dans le schéma Agent |
| Ajouter une propriété obligatoire dans la version majeure suivante | ⚠️ Possible | `modelCapabilities` devient obligatoire en v2.0.0 |
| Supprimer une propriété optionnelle | ❌ Non (sauf dépréciation) | Doit rester 2 versions majeures |
| Supprimer une propriété obligatoire | ❌ Interdit | Impossible sans changer de version majeure |
| Renommer une propriété | ❌ Non | Créer une nouvelle propriété, déprécier l'ancienne |
| Changer le type d'une propriété | ❌ Non | Incompatible, nécessite une nouvelle propriété |
| Ajouter une valeur admise à une énumération | ✅ Oui | Nouveau `domain` personnalisé |
| Retirer une valeur admise d'une énumération | ❌ Non | Dépréciation sur 2 versions majeures |

### 7.2 Dépréciation des fichiers

Lorsqu'une ressource (agent, règle, livrable) est retirée du Registry de base, le fichier correspondant n'est pas supprimé immédiatement mais marqué comme déprécié :

```json
{
  "id": "EXP-00-Legacy-Agent",
  "status": "deprecated",
  "deprecation": {
    "since": "1.2.0",
    "removedIn": "3.0.0",
    "replacement": "EXP-07-AI-Architect",
    "reason": "Fusionné avec le nouvel agent Architecte IA"
  }
}
```

**Règles :**
- Un fichier déprécié doit rester présent dans le Registry pendant au moins **2 versions majeures** suivant la version où il a été marqué comme déprécié.
- Les outils doivent ignorer les ressources dépréciées par défaut, avec une option pour les inclure.
- La propriété `deprecation.replacement` indique la ressource de remplacement, si applicable.

### 7.3 Garanties

Le Registry AKORIS offre les garanties de rétrocompatibilité suivantes :

1. **Compatibilité ascendante des schémas** : tout JSON valide pour la version N du Registry reste valide pour la version N+1 (ajouts uniquement).
2. **Non-rétractation des identifiants** : un ID de ressource, une fois publié, ne peut jamais être réaffecté ou supprimé (seulement déprécié).
3. **Stabilité des chemins** : le chemin d'accès à une ressource (`registry/agents/CORE-01-Orchestrator/agent.json`) est stable à travers les versions majeures.
4. **Ignorance des champs inconnus** : les outils clients doivent ignorer les champs qu'ils ne reconnaissent pas dans un JSON.
5. **Valeurs par défaut** : toute propriété ajoutée doit avoir une valeur par défaut explicite qui préserve le comportement existant.

### 7.4 Test de compatibilité

Chaque version du Registry doit passer une suite de tests de compatibilité comprenant :

- Validation de tous les fichiers JSON contre leurs schémas respectifs
- Vérification de l'intégrité référentielle de l'ensemble des relations
- Test de chargement par un outil client de la version précédente
- Vérification qu'aucun identifiant n'a été réaffecté
- Validation des contraintes de cycle dans le graphe de dépendances

---

## 8. Extension et personnalisation

Le Registry AKORIS est conçu pour être extensible. Les organisations, équipes ou projets peuvent l'enrichir sans jamais casser les contrats de base.

### 8.1 Domaines personnalisés

En plus des cinq domaines de base (CORE, DEV, QA, EXP, GOV), les projets peuvent définir leurs propres préfixes de domaine pour les agents personnalisés.

**Règles :**
- Le préfixe doit comporter 3 à 6 lettres majuscules
- Il ne doit pas entrer en conflit avec un domaine existant
- Il doit être déclaré dans `registry.json` sous la propriété `customDomains`

```json
{
  "customDomains": [
    {
      "prefix": "DATA",
      "name": "Data Science",
      "description": "Domaine dédié aux agents de traitement et d'analyse de données"
    },
    {
      "prefix": "INFRA",
      "name": "Infrastructure",
      "description": "Domaine dédié aux agents d'infrastructure et d'exploitation"
    }
  ]
}
```

### 8.2 Agents d'extension

Les projets peuvent ajouter leurs propres agents dans le répertoire `registry/agents/` en utilisant un ID au format `{DOMAINE}-{NN}-{Slug}` avec leur domaine personnalisé.

**Exemple pour un projet utilisant un agent Data Engineer personnalisé :**

```
registry/agents/DATA-01-Data-Engineer/
├── agent.json
└── prompts/
    ├── init.md
    └── execute.md
```

Le fichier `agent.json` suit exactement le même schéma que les agents de base. Les agents personnalisés peuvent référencer les agents de base comme dépendances.

### 8.3 Capacités tierces

Le fichier `capabilities.json` peut être enrichi avec des capacités fournies par des partenaires ou des outils externes :

```json
{
  "capabilities": [
    {
      "id": "CAP-CLOUD-001",
      "name": "Déploiement AWS",
      "provider": "Amazon Web Services",
      "type": "external",
      "version": "1.0.0",
      "agents": ["DEV-08-DevOps-Engineer"],
      "description": "Capacité de déploiement automatisé sur AWS CloudFormation"
    }
  ]
}
```

### 8.4 Personnalisation des playbooks

Les playbooks se trouvent dans `registry/playbooks/` et décrivent des procédures spécifiques à une pile technologique. Les projets peuvent ajouter leurs propres playbooks sans modifier les playbooks de base.

**Règles :**
- Un playbook de base ne peut pas être modifié directement
- Un projet peut créer un playbook surcouche qui étend un playbook de base via la propriété `extends`
- Les playbooks projet résident dans `extensions/playbooks/`

```json
{
  "id": "PLB-004",
  "name": "Playbook d'infrastructure cloud AWS",
  "extends": "PLB-003",
  "stack": "aws",
  "steps": [
    { "order": 1, "action": "VPC / Networking", "agent": "DEV-08-DevOps-Engineer" },
    { "order": 2, "action": "ECS / Fargate", "agent": "DEV-08-DevOps-Engineer" }
  ]
}
```

### 8.5 Répertoire d'extension projet

Au niveau du projet, le répertoire `.akoris/extensions/` permet d'ajouter des ressources projet-spécifiques :

```
.akoris/
├── manifest.json
├── state.json
├── extensions/
│   ├── agents/
│   │   └── DATA-01-Data-Engineer/
│   │       └── agent.json
│   ├── rules/
│   │   └── RULE-200.json
│   ├── playbooks/
│   │   └── custom-deploy.json
│   └── README.md
└── ...
```

**Règles pour les extensions :**
- Les ressources d'extension utilisent la numérotation à partir de 200 (ex: RULE-200) pour éviter les conflits avec le Registry de base (001-199)
- Les extensions peuvent référencer les ressources de base, mais pas l'inverse
- Les extensions sont liées au projet et ne sont pas partagées entre projets sauf via un package de distribution

### 8.6 Contrats personnalisés

Les organisations peuvent définir des templates de contrat personnalisés dans `registry/contracts/` :

```json
{
  "id": "CTR-CUSTOM-001",
  "name": "Contrat de niveau de service interne",
  "version": "1.0.0",
  "type": "SLA",
  "clauses": [
    {
      "id": "CLAUSE-001",
      "title": "Disponibilité",
      "description": "L'engagement de disponibilité est de 99.9 %"
    }
  ]
}
```

---

## 9. Index des chemins normalisés

Cette section définit l'ensemble des chemins normalisés au sein d'un projet AKORIS. Chaque chemin a une signification précise et un contenu attendu.

### 9.1 Structure racine du projet

```
.akoris/
├── manifest.json                      # Identité et configuration du projet
├── state.json                         # État courant de la machine à états
├── project.env                        # Variables d'environnement du projet
├── .gitignore                         # Règles d'ignorance Git pour AKORIS
│
├── adr/                               # Architecture Decision Records
│   ├── ADR-001.md
│   ├── ADR-002.md
│   └── ...
│
├── sprints/                           # Rapports de sprint
│   ├── sprint-001/
│   │   ├── report.json
│   │   └── retrospective.json
│   ├── sprint-002/
│   └── ...
│
├── audits/                            # Rapports d'audit
│   ├── audit-2026-07-01.json
│   └── ...
│
├── knowledge/                         # Base de connaissances du projet
│   ├── index.json
│   ├── decisions/
│   ├── patterns/
│   ├── glossaire-projet.json
│   └── README.md
│
├── logs/                              # Journaux d'exécution des agents
│   ├── sessions/
│   │   ├── 2026-07-25-CORE-01.jsonl
│   │   └── ...
│   └── errors/
│       └── error-2026-07-25.log
│
├── metrics/                           # Métriques collectées du projet
│   ├── velocity.json
│   ├── quality.json
│   └── coverage.json
│
├── extensions/                        # Extensions projet-spécifiques
│   ├── agents/
│   ├── rules/
│   ├── playbooks/
│   └── README.md
│
└── temp/                              # Fichiers temporaires (ignorés par Git)
    └── .gitkeep
```

### 9.2 Tableau des chemins normalisés

| Chemin | Description | Obligatoire | Format |
|--------|-------------|-------------|--------|
| `.akoris/manifest.json` | Identité et configuration du projet AKORIS | Oui | JSON |
| `.akoris/state.json` | État courant de la machine à états du projet | Oui | JSON |
| `.akoris/project.env` | Variables d'environnement et secrets du projet | Non | ENV |
| `.akoris/.gitignore` | Règles d'ignorance pour les fichiers AKORIS | Recommandé | Gitignore |
| `.akoris/adr/` | Architecture Decision Records | Recommandé | MD |
| `.akoris/adr/ADR-{NNN}.md` | Décision d'architecture individuelle | Recommandé | Markdown |
| `.akoris/sprints/` | Rapports et rétrospectives de sprint | Recommandé | JSON |
| `.akoris/sprints/sprint-{NNN}/report.json` | Rapport d'un sprint | Recommandé | JSON |
| `.akoris/audits/` | Rapports d'audit automatiques et manuels | Recommandé | JSON |
| `.akoris/knowledge/` | Base de connaissances du projet | Recommandé | JSON/MD |
| `.akoris/knowledge/index.json` | Index de la base de connaissances | Recommandé | JSON |
| `.akoris/knowledge/decisions/` | Registre des décisions de conception | Non | MD |
| `.akoris/knowledge/patterns/` | Catalogues de patterns réutilisables | Non | MD |
| `.akoris/logs/` | Journaux d'exécution | Recommandé | JSONL/LOG |
| `.akoris/logs/sessions/` | Sessions d'exécution des agents | Recommandé | JSONL |
| `.akoris/logs/errors/` | Journaux d'erreurs | Recommandé | LOG |
| `.akoris/metrics/` | Métriques collectées | Recommandé | JSON |
| `.akoris/metrics/velocity.json` | Métrique de vélocité | Non | JSON |
| `.akoris/metrics/quality.json` | Métrique de qualité | Non | JSON |
| `.akoris/metrics/coverage.json` | Métrique de couverture | Non | JSON |
| `.akoris/extensions/` | Extensions projet-spécifiques | Non | JSON/MD |
| `.akoris/extensions/agents/` | Agents personnalisés du projet | Non | JSON |
| `.akoris/extensions/rules/` | Règles personnalisées du projet | Non | JSON |
| `.akoris/extensions/playbooks/` | Playbooks personnalisés du projet | Non | JSON |
| `.akoris/temp/` | Fichiers temporaires (ignorés par Git) | Non | — |

### 9.3 Fichier manifest.json

```json
{
  "$schema": "https://schemas.akoris.dev/manifest.schema.json",
  "projectName": "NomDuProjet",
  "projectId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "akorisVersion": "^1.0.0",
  "registryPath": "../registry/",
  "createdAt": "2026-07-25",
  "updatedAt": "2026-07-25",
  "agents": ["CORE-01", "DEV-03", "QA-05", "EXP-02"],
  "defaultLanguage": "fr",
  "domain": "web-app",
  "repository": {
    "url": "https://github.com/organisation/projet",
    "branch": "main"
  }
}
```

### 9.4 Fichier state.json

```json
{
  "$schema": "https://schemas.akoris.dev/state.schema.json",
  "projectId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "currentPhase": "execution",
  "currentState": "development",
  "transitions": [
    {
      "from": "initialized",
      "to": "development",
      "at": "2026-07-26T08:00:00Z",
      "authorizedBy": "GOV-01-Project-Manager",
      "qualityGates": ["QG-001", "QG-002"]
    }
  ],
  "activeAgents": ["CORE-01", "DEV-03"],
  "completedGates": ["QG-001"],
  "pendingGates": ["QG-003"],
  "lastTransition": "2026-07-26T08:00:00Z"
}
```

---

## 10. Annexes

### Annexe A : Glossaire des termes

Le glossaire formel complet est maintenu dans le fichier `registry/glossary/glossary.json`. Les termes essentiels sont définis ci-dessous.

| Terme | Définition |
|-------|-----------|
| **Agent** | Rôle logiciel autonome participant au processus de développement, défini par un contrat formel dans le Registry |
| **AKORIS** | Artificial Knowledge Orchestrator for Reliable Integrated Software — Standard de gouvernance pour le développement logiciel assisté par IA |
| **Contrat** | Définition formelle et exécutable d'un agent, d'une règle ou d'un livrable, exprimée en JSON |
| **Domaine** | Catégorie fonctionnelle d'agents (CORE, DEV, QA, EXP, GOV) |
| **Événement** | Signal déclencheur dans le cycle de vie du projet, pouvant activer des agents ou lancer des workflows |
| **Gouvernance** | Ensemble des règles, politiques et processus qui encadrent le développement du projet |
| **Livrable** | Artefact produit ou consommé par un ou plusieurs agents |
| **Machine à états** | Modèle formel décrivant les états possibles du projet et les transitions autorisées |
| **Métrique** | Indicateur quantifiable utilisé pour évaluer la performance des agents ou la qualité des livrables |
| **Ontologie** | Vocabulaire formel partagé définissant les concepts, relations et axiomes du domaine AKORIS |
| **Playbook** | Procédure standardisée pour une pile technologique ou un contexte spécifique |
| **Politique** | Règle de gouvernance organisationnelle s'imposant à tous les projets |
| **Quality Gate** | Point de contrôle validant qu'un artefact respecte des critères prédéfinis |
| **Registry** | Référentiel central de gouvernance contenant l'ensemble des contrats, règles et définitions |
| **Règle** | Condition exécutable de gouvernance avec conséquence en cas de violation |
| **Transition** | Passage d'un état à un autre dans la machine à états du projet |
| **Workflow** | Séquence d'étapes exécutées par des agents en réponse à un ou plusieurs événements |

### Annexe B : Historique des modifications

| Version | Date | Description | Auteur |
|---------|------|-------------|--------|
| 1.0.0 | 2026-07-25 | Version initiale de la spécification du Registry AKORIS | AKORIS Core Team |

### Annexe C : Contributeurs

La spécification AKORIS Registry Specification (ARS) est maintenue par l'AKORIS Core Team. Les contributions sont ouvertes via le dépôt officiel du projet.

**Membres fondateurs de l'AKORIS Core Team :**

- **Jean Dupont** — Architecte principal, conception du Registry et des schémas
- **Marie Lambert** — Experte en gouvernance logicielle, définition des politiques et règles
- **Thomas Girard** — Ingénieur en systèmes IA, ontologie et relations entre objets
- **Sophie Moreau** — Responsable qualité, définition des Quality Gates et métriques
- **Lucas Bernard** — Expert en versionnement et rétrocompatibilité
- **Camille Petit** — Documentation et normalisation des conventions de nommage

### Annexe D : Références

- [SemVer 2.0.0](https://semver.org/) — Spécification du versionnement sémantique
- [JSON Schema Draft 2020-12](https://json-schema.org/specification) — Spécification des schémas JSON
- [RFC 3339](https://tools.ietf.org/html/rfc3339) — Format de date ISO 8601 pour les protocoles Internet
- [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) — Format de date et heure international
- [Keep a Changelog](https://keepachangelog.com/) — Convention pour les journaux de modifications

---

> **Fin du document — AKORIS Registry Specification v1.0.0**
>
> Ce document est diffusé sous licence MIT. Son contenu est normatif pour toute implémentation du standard AKORIS.
