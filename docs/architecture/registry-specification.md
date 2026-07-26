# Spécification du Registry AKORIS (v1.x)

Le Registry est le cœur d'AKORIS. Il contient l'ensemble des définitions de gouvernance : agents, règles, événements, workflows, Quality Gates, métriques, livrables et leurs relations.

---

## Structure du dossier `registry/`

```
registry/
├── registry.json                # Index global (version, compteurs, chemin des composants)
├── state-machine.json           # Machine à états (7 états, 8 transitions)
├── activation-matrix.json       # Événements → agents activés
├── capabilities.json            # Capacités → agents
├── dependency-graph.json        # Dépendances entre agents
├── ontology.json                # Définitions conceptuelles (domaines, types)
│
├── agents/                      # Dossiers individuels des 33 agents
│   └── {DOMAINE}-{NN}-{Nom}/
│       ├── agent.json           # Métadonnées (ID, version, criticité, tags)
│       ├── contract.json        # Version machine-readable du contrat
│       ├── capabilities.json    # can / cannot
│       ├── mission.md           # Objectif, scope
│       ├── activation.md        # Conditions d'activation
│       ├── inputs.md / outputs.md
│       ├── quality-gates.md
│       ├── prompt.md
│       ├── CHANGELOG.md
│       └── tests/               # Scénarios de test
│
├── rules/                       # Règles formelles (if → then)
├── deliverables/                # Livrables standardisés
├── events/                      # Événements du cycle de vie
├── workflows/                   # Séquences d'étapes exécutées par des agents
├── policies/                    # Politiques de gouvernance organisationnelle
├── quality-gates/               # Points de contrôle (QG-xxx)
├── metrics/                     # Indicateurs quantifiables
├── schemas/                     # Schémas JSON (validation)
└── api/                         # Contrats OpenAPI pour l'API interne
```

---

## Format d'un agent

Chaque agent est identifié par un ID unique au format `{DOMAINE}-{NN}-{Nom}` où :

- `DOMAINE` : `CORE`, `DEV`, `QA`, `EXP`, `GOV` (ou domaine personnalisé)
- `NN` : numéro séquentiel à deux chiffres (01 à 99)
- `Nom` : nom en PascalCase décrivant le rôle

Exemple : `CORE-02-Solution-Architect`

### `agent.json` (exemple)

```json
{
  "$schema": "../schemas/agent.schema.json",
  "id": "CORE-01-Orchestrator",
  "name": "Orchestrateur",
  "version": "1.0.0",
  "domain": "CORE",
  "criticity": "critique",
  "status": "active",
  "description": "Agent coordinateur principal, responsable de l'activation et de la coordination des autres agents.",
  "tags": ["core", "coordination", "orchestration"],
  "dependencies": [
    { "agentId": "CORE-02-Solution-Architect", "type": "mandatory" }
  ],
  "tokenEstimate": 4096,
  "activatedBy": ["EVT-001", "EVT-005"],
  "produces": ["DEL-001", "DEL-002"],
  "validatedBy": ["QG-001", "QG-002"]
}
```

---

## Relations clés

| Source | Relation | Cible |
|--------|----------|-------|
| Agent | `dependsOn` | Agent |
| Agent | `produces` | Deliverable |
| Agent | `consumes` | Deliverable |
| Agent | `validatedBy` | QualityGate |
| Agent | `activatedBy` | Event |
| Event | `triggers` | Workflow |
| Workflow | `executedBy` | Agent |
| Rule | `enforces` | Agent |
| Deliverable | `validatedBy` | QualityGate |

---

## Contraintes d'intégrité (validées par `akoris registry validate`)

- Toute référence à un ID doit pointer vers une ressource existante.
- Le graphe des dépendances entre agents ne contient pas de cycle.
- Tout agent est associé à au moins un Quality Gate.
- Les identifiants sont uniques.

---

## Évolution du Registry

Le Registry est versionné globalement via `registry.json`. Les modifications qui n'affectent pas la compatibilité (ajout d'agent, nouvelle règle, nouveau livrable) sont considérées comme des évolutions mineures. Les changements incompatibles (suppression d'un champ obligatoire, modification de la sémantique d'un schéma) nécessitent une version majeure du Registry et ne sont pas introduits dans la v1.x.

---

**Voir aussi** : [ADR-003](../adr/ADR-003-why-state-machine.md), [ADR-004](../adr/ADR-004-why-search-engine.md)
