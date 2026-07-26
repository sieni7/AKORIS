# Spécification du Registry AKORIS

Le Registry est le référentiel central de gouvernance. Il contient la définition de tous les agents, règles, événements, capacités et livrables.

---

## Structure du dépôt

```
registry/
├── registry.json              # Index général (version 2.0.0)
├── dependency-graph.json      # Graphe de dépendances entre agents
├── activation-matrix.json     # Matrice d'activation (18 événements)
├── capabilities.json          # Catalogue de 72 capacités
├── state-machine.json         # Machine à états (7 états, 8 transitions)
├── ontology.json              # Ontologie du domaine
├── agents/                    # 33 agents (un sous-dossier par agent)
├── rules/                     # 12 règles (RULE-001 à RULE-012)
├── deliverables/              # 15 livrables
├── events/                    # Événements du cycle de vie
├── policies/                  # Politiques de gouvernance
├── quality-gates/             # Quality Gates
├── templates/                 # Templates (ADR, playbooks)
├── schemas/                   # Schémas JSON de validation
├── contracts/                 # Contrats des agents
├── workflows/                 # Workflows
├── metrics/                   # Définitions de métriques
├── conventions/               # Conventions de nommage
├── checklists/                # Checklists par agent
└── playbooks/                 # Playbooks par stack
```

## Fichier d'index (`registry.json`)

```json
{
  "name": "AKORIS Registry",
  "version": "2.0.0",
  "description": "Référentiel central de gouvernance AKORIS",
  "components": {
    "agents": { "count": 33, "path": "agents/" },
    "rules": { "count": 12, "path": "rules/" },
    "qualityGates": { "count": 15, "path": "quality-gates/" }
  },
  "domains": [
    { "id": "CORE", "name": "Gouvernance", "agentCount": 8 },
    { "id": "DEV", "name": "Architecture & Développement", "agentCount": 8 },
    { "id": "QA", "name": "Qualité", "agentCount": 7 },
    { "id": "EXP", "name": "Expertise", "agentCount": 7 },
    { "id": "GOV", "name": "Gouvernance transverse", "agentCount": 3 }
  ]
}
```

## Agents

Chaque agent est défini dans `registry/agents/<ID>-<Nom>/agent.json` :

```json
{
  "id": "CORE-01",
  "name": "Orchestrator",
  "version": "1.0.0",
  "domain": "Gouvernance",
  "criticity": "critique",
  "status": "active",
  "tags": ["core", "orchestration", "governance"],
  "dependencies": [],
  "maintainer": "AKORIS Core Team",
  "tokenEstimate": { "context": 8000, "prompt": 2000, "output": 1000 }
}
```

Les fichiers additionnels dans le dossier de l'agent :
- `contract.json` — contrat formel (entrées, sorties, contraintes)
- `capabilities.json` — capacités (can/cannot)
- `README.md` — description longue
- `prompt.md`, `mission.md`, `kpis.md`, `quality-gates.md`

## Règles

Définies dans `registry/rules/RULE-NNN.json` :

```json
{
  "id": "RULE-001",
  "name": "Release Requires Security Clearance",
  "description": "SecurityAuditor (QA-03) must approve before any release proceeds",
  "severity": "blocker",
  "tags": ["security", "release", "governance"],
  "if": "SecurityAuditor (QA-03) has not approved the release",
  "then": "Release is forbidden",
  "otherwise": "Release may proceed to Quality Gate validation"
}
```

Niveaux de sévérité : `blocker`, `critical`, `major`, `minor`, `info`.

## Capacités

Définies dans `capabilities.json` : 72 capacités associées à des agents.

```json
{
  "version": "1.0.0",
  "capabilities": {
    "define_security_policy": ["CORE-05"],
    "design_api_contract": ["DEV-03"],
    "write_unit_tests": ["QA-02"]
  }
}
```

## Lecture par le CLI

Le service `RegistryReaderV2` charge les données avec cache (TTL : 5 minutes) :

```typescript
const reader = new RegistryReaderV2();
reader.getRules();              // → Rule[]
reader.listAgentDirs();         // → string[]
reader.readAgentJson(dir);      // → agent object
reader.getCapabilityRegistry(); // → CapabilityRegistry
```

Détection automatique du chemin : le reader remonte depuis le répertoire courant jusqu'à trouver `registry/registry.json`.
