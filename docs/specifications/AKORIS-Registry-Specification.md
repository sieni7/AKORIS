# AKORIS Registry Specification (ARS)

> **Version** : 1.0.1
> **Status** : Approved
> **Date** : 2026-09-04
> **Maintainer** : AKORIS Core Team
> **License** : MIT

---

## 1. Introduction

### 1.1 Objectif

Ce document définit la spécification officielle du **Registry AKORIS**, le référentiel central de gouvernance pour le développement logiciel assisté par IA.

**AKORIS** (*Adaptive Knowledge & Orchestrated Review for Intelligent Software*) est un standard de gouvernance qui structure le développement logiciel grâce à un ensemble d'agents spécialisés, de Quality Gates et de règles, afin de garantir qualité, sécurité, traçabilité et conformité de bout en bout.

### 1.2 Domaine d'application

Le Registry AKORIS est utilisé par les projets conformes à la méthode AKORIS pour :

- Déclarer et orchestrer les **agents** participant au développement ;
- Définir et appliquer les **Quality Gates** aux transitions de la machine à états ;
- Spécifier et contrôler les **politiques** de sécurité et de gouvernance ;
- Rendre le processus **reproductible** et **auditable**.

### 1.3 Document de référence

Ce document s'articule avec la spécification de la **méthode AKORIS (v1.0.1)** et la **machine à états** du registry.

---

## 2. Principes fondamentaux

1. **Traceabilité** : toute décision, transition ou livrable est enregistré et historisé.
2. **Séparation des préoccupations** : chaque agent dispose d'un contrat formel (mission, responsabilités, limites).
3. **Gates objectifs** : les passages d'état sont soumis à des Quality Gates dont les critères sont objectifs et mesurables.
4. **Gouvernance par rôles** : l'activation, la validation et l'arbitrage sont confiés à des rôles dédiés.
5. **Axé connaissance** : les structures (schémas, politiques, gates) garantissent une base de connaissances fiable et cohérente.

---

## 3. Structure du Registry

### 3.1 Organisation des répertoires

```
registry/
├── schemas/            # Schémas JSON (draft-07)
├── agents/             # 40 agents ({ID}/agent.json)
├── quality-gates/      # Gates de phase (QG-{PHASE})
├── profiles/           # Profils d'exécution (lite, standard, critical)
├── policies/           # Politiques applicables
├── state-machine.json  # Machine à états
└── metrics/            # Métriques de mesure
```

### 3.2 Manifest du registry (`registry.json`)

Le fichier `registry.json` décrit le Registry lui-même.

```json
{
  "$schema": "./schemas/registry.schema.json",
  "id": "akoris-registry",
  "name": "Registry AKORIS",
  "version": "1.0.1",
  "description": "Référentiel central de gouvernance AKORIS",
  "maintainer": "AKORIS Core Team",
  "license": "MIT",
  "createdAt": "2026-09-04",
  "updatedAt": "2026-09-04",
  "agentCount": 40,
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

---

## 4. Les agents

### 4.1 Format d'un agent

Chaque agent est décrit par un fichier JSON dans `registry/agents/{ID}/agent.json`, conforme au schéma `agent.schema.json`.

```json
{
  "$schema": "../../schemas/agent.schema.json",
  "id": "CORE-01",
  "name": "Orchestrator",
  "version": "1.0.0",
  "domain": "CORE",
  "criticity": "critique",
  "status": "active",
  "mission": "Coordonne tous les agents, arbitre les conflits, valide les transitions entre phases.",
  "responsibilities": ["Coordination des agents", "Arbitrage des conflits", "Validation des transitions"],
  "limits": ["Ne pas écrire de code applicatif", "Ne pas décider seul des choix métier"]
}
```

### 4.2 Identifiants

- Format court : `{DOMAINE}-{NN}` (ex. `CORE-01`, `DEV-10`, `QA-03`, `EXP-07`, `GOV-02`).
- Pattern : `^[A-Z]{2,4}-[0-9]{2}$`.

### 4.3 Domaines et distribution (40 agents)

| Domaine | Nombre | Rôle |
|---|---|---|
| **CORE** | 8 | Cœur : orchestration, architecture, sécurité, gouvernance |
| **DEV** | 10 | Développement : frontend, backend, API, intégration |
| **QA** | 8 | Qualité : revue, tests, audits sécurité/performance/accessibilité |
| **EXP** | 10 | Expertise : IA, SaaS, mobile, données, conformité, plateforme |
| **GOV** | 4 | Gouvernance : méthode, gates, connaissance, release |
| **Total** | **40** | |

### 4.4 Attributs de criticité

L'attribut `criticity` d'un agent peut prendre l'une des valeurs suivantes (aligné sur le schéma) :

`critique`, `haute`, `moyenne`, `basse`

### 4.5 Statuts d'un agent

`active`, `inactive`, `deprecated`, `draft`

---

## 5. Les Quality Gates

### 5.1 Convention de nommage

Les gates sont identifiés selon leur phase cible de la machine à états :

- `QG-PROPOSITION`
- `QG-DRAFT`
- `QG-PLANNED`
- `QG-ACTIVE`
- `QG-AUDIT`
- `QG-VALIDATED`

Pattern : `^QG-[A-Z]{3,15}$`.

> **Rétrocompatibilité** : les identifiants historiques `QG-001` et `QG-002` sont des aliases de `QG-PROPOSITION` et `QG-DRAFT`.

### 5.2 Format d'un Quality Gate

```json
{
  "$schema": "../schemas/quality-gate.schema.json",
  "id": "QG-PROPOSITION",
  "name": "Validation de proposition",
  "description": "Vérifie qu'une proposition contient le contexte, la justification et une ébauche de solution.",
  "severity": "bloquante",
  "owner": "CORE-03",
  "criteria": [
    { "id": "CRIT-001", "name": "Contexte présent", "evaluator": "field_exists", "params": { "field": "context" }, "weight": 0.4 },
    { "id": "CRIT-002", "name": "Justification présente", "evaluator": "field_exists", "params": { "field": "justification" }, "weight": 0.3 },
    { "id": "CRIT-003", "name": "Ébauche de solution", "evaluator": "field_exists", "params": { "field": "solution" }, "weight": 0.3 }
  ],
  "threshold": 0.7,
  "controls": ["TRN-001"],
  "tags": ["validation", "proposition"]
}
```

### 5.3 Niveaux de sévérité

`bloquante`, `critique`, `majeure`, `mineure`

---

## 6. La machine à états

### 6.1 États nominaux

`PROPOSITION → DRAFT → PLANNED → ACTIVE → AUDIT → VALIDATED → RELEASED → ARCHIVED`

### 6.2 États exceptionnels

`BLOCKED`, `REJECTED`, `SUPERSEDED`

### 6.3 Transitions

Chaque transition peut déclencher un ou plusieurs Quality Gates (`requires`).

Exemple (`state-machine.json`) :

```json
{ "from": "PROPOSITION", "to": "DRAFT", "requires": ["QG-PROPOSITION"], "required": true, "authorizedBy": ["VALIDATOR"] }
```

---

## 7. Les profils

| Profil | Mode Quality Gates | Usage |
|---|---|---|
| **lite** | essential | Prototypes et projets solo |
| **standard** | complete | Projets logiciels standard |
| **critical** | complete+reinforced | Projets à forte criticité |

Les profils peuvent référencer des gates et des sélecteurs d'agents.

---

## 8. Les schémas

Le Registry fournit les schémas JSON suivants (draft-07) :

| Schéma | Objet validé |
|---|---|
| `agent.schema.json` | Fichier `agent.json` |
| `quality-gate.schema.json` | Fichier `QG-{PHASE}.json` |
| `policy.schema.json` | Politiques |
| `manifest.schema.json` | Manifest de projet |
| `state.schema.json` | État de projet |
| `state-machine.schema.json` | `state-machine.json` |
| `adr.schema.json` | Décisions d'architecture (ADR) |
| `metric.schema.json` | Métriques |
| `sunset.schema.json` | Rétractations / fins de service |

---

## Annexe A — Glossaire

| Terme | Définition |
|---|---|
| **AKORIS** | *Adaptive Knowledge & Orchestrated Review for Intelligent Software* — Standard de gouvernance pour le développement logiciel assisté par IA |
| **Agent** | Rôle logiciel autonome participant au processus de développement, défini par un contrat formel dans le Registry |
| **Quality Gate (QG)** | Ensemble de critères objectifs à satisfaire pour autoriser une transition d'état |
| **ADR** | *Architecture Decision Record* — trace d'une décision d'architecture |

---

## Annexe B — Versionnement

- **Version actuelle** : 1.0.1 (Approuvée)
- **Statut** : Approved
- **Date** : 2026-09-04

### Historique

| Version | Statut | Date | Changements |
|---|---|---|---|
| 1.0.0 | Draft | 2026-07-25 | Version initiale |
| 1.0.1 | Approved | 2026-09-04 | Alignement : acronyme officiel, 40 agents, IDs courts, criticité `haute` |

---

## Annexe C — Contributeurs

**Membres fondateurs de l'AKORIS Core Team :**

- **OULAÏ SIÉNI** — Concepteur principal, vision et architecture d'AKORIS
