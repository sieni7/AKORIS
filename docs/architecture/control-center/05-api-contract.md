---
title: "AKORIS Control Center — API Contract"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "03-core.md"
  - "04-domain-model.md"
  - "06-events.md"
  - "07-websocket.md"
  - "11-sdk.md"
  - "ADR-004-fastify.md"
---

# 05 — API Contract

## 1. Objectif

Ce document définit le **contrat REST** complet de l'API AKORIS Control Center. Tous les endpoints, leurs formats de requête et réponse, et les codes d'erreur sont spécifiés. Ce contrat est la source de vérité pour le SDK et le Dashboard.

---

## 2. Principes

- **Base URL** : `/api/v1`
- **Format** : JSON (Content-Type: `application/json`)
- **Versionning** : par préfixe de chemin (`/api/v1/`)
- **Validation** : tous les endpoints valident les entrées avec Zod
- **Erreurs** : format standardisé (voir section 8)

---

## 3. Endpoints

### 3.1. Health

```
GET /api/v1/health
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "1.0.0",
    "uptime": 3600
  }
}
```

---

### 3.2. State

#### Get current state

```
GET /api/v1/state
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "current": "Draft",
    "available": ["Draft", "Planned", "Active", "Completed", "Archived"],
    "history": [
      {
        "from": "",
        "to": "Draft",
        "timestamp": "2026-07-26T10:00:00Z",
        "gatesPassed": []
      }
    ],
    "lastUpdated": "2026-07-26T10:00:00Z"
  }
}
```

#### Get transition history

```
GET /api/v1/state/history
```

**Query params:**
- `limit` (number, optional) : Nombre d'entrées
- `offset` (number, optional) : Pagination

**Response 200:**
```json
{
  "success": true,
  "data": {
    "transitions": [
      {
        "from": "",
        "to": "Draft",
        "timestamp": "2026-07-26T10:00:00Z",
        "actor": "CLI",
        "gatesPassed": [],
        "gatesFailed": null
      }
    ],
    "total": 1
  }
}
```

#### Execute a transition

```
POST /api/v1/state/transition
```

**Request body:**
```json
{
  "from": "Draft",
  "to": "Planned",
  "actor": "user@example.com"
}
```

**Response 200 (success):**
```json
{
  "success": true,
  "data": {
    "from": "Draft",
    "to": "Planned",
    "timestamp": "2026-07-26T12:00:00Z",
    "gatesPassed": ["QG-01", "QG-02"],
    "gatesFailed": null
  }
}
```

**Response 400 (gate failed):**
```json
{
  "success": false,
  "error": {
    "code": "GATE_FAILED",
    "message": "Quality Gate QG-01 non satisfait",
    "suggestion": "Complétez les livrables requis avant de transitionner",
    "details": {
      "gateId": "QG-01",
      "reason": "Deliverable D-003 is not completed"
    }
  }
}
```

**Response 400 (invalid transition):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Transition \"Draft → Active\" non définie",
    "suggestion": "Transitions possibles : Planned"
  }
}
```

---

### 3.3. Registry

#### List agents

```
GET /api/v1/registry/agents
```

**Query params:**
- `domain` (string, optional) : Filtre par domaine
- `status` (string, optional) : Filtre par statut
- `tag` (string, optional) : Filtre par tag

**Response 200:**
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "DEV-04",
        "name": "DevSecOps",
        "domain": "development",
        "status": "active",
        "rules": ["R-001", "R-002"],
        "capabilities": ["C-001", "C-014"],
        "tags": ["security", "ci-cd"],
        "description": "Agent DevSecOps référent"
      }
    ],
    "total": 1
  }
}
```

#### Get agent detail

```
GET /api/v1/registry/agents/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "DEV-04",
    "name": "DevSecOps",
    "domain": "development",
    "status": "active",
    "rules": ["R-001", "R-002"],
    "capabilities": ["C-001", "C-014"],
    "tags": ["security", "ci-cd"],
    "description": "Agent DevSecOps référent",
    "promptTemplate": "...",
    "metadata": {
      "version": "1.2"
    }
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent DEV-99 not found",
    "suggestion": "Check registry/agents/ for available agents"
  }
}
```

#### List rules

```
GET /api/v1/registry/rules
```

**Query params:**
- `severity` (string, optional) : `critical | major | minor | info`
- `scope` (string, optional) : Domaine

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "R-001",
        "name": "ADR obligatoire avant implémentation",
        "description": "Toute modification majeure doit être précédée d'un ADR",
        "severity": "critical",
        "scope": "architecture",
        "tags": ["adr", "governance"]
      }
    ],
    "total": 1
  }
}
```

#### List capabilities

```
GET /api/v1/registry/capabilities
```

**Query params:**
- `agentId` (string, optional) : Filtre par agent
- `type` (string, optional) : `skill | knowledge | tool | process`
- `status` (string, optional) : `available | deprecated | experimental`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "capabilities": [
      {
        "id": "C-014",
        "name": "Analyse de sécurité automatisée",
        "description": "Analyse des vulnérabilités dans le code",
        "agentId": "DEV-04",
        "type": "tool",
        "status": "available"
      }
    ],
    "total": 1
  }
}
```

#### List quality gates

```
GET /api/v1/registry/quality-gates
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "qualityGates": [
      {
        "id": "QG-01",
        "name": "Documentation complète",
        "description": "Tous les ADR et livrables sont rédigés",
        "transitions": [{ "from": "Draft", "to": "Planned" }],
        "checks": [
          {
            "id": "QG-01-check-1",
            "type": "file_exists",
            "target": "docs/adr/ADR-001.md",
            "description": "ADR-001 doit exister"
          }
        ]
      }
    ],
    "total": 1
  }
}
```

---

### 3.4. Search

#### Search all sources

```
GET /api/v1/search?q={query}
```

**Query params:**
- `q` (string, required) : Terme de recherche
- `type` (string, optional) : `agent | rule | capability | adr | log | prompt`
- `limit` (number, optional, default: 20)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "query": "transition Draft",
    "total": 3,
    "results": [
      {
        "type": "agent",
        "id": "CORE-01",
        "title": "Core",
        "description": "Agent Cœur AKORIS",
        "match": "... transition Draft vers Planned ...",
        "score": 0.95
      },
      {
        "type": "rule",
        "id": "R-003",
        "title": "Règle de transition",
        "description": "Les transitions doivent être validées",
        "match": "... transition Draft ...",
        "score": 0.82
      }
    ]
  }
}
```

---

### 3.5. Logs

#### Read logs

```
GET /api/v1/logs
```

**Query params:**
- `lines` (number, optional, default: 50)
- `agent` (string, optional) : Filtre par agent
- `level` (string, optional) : `info | warn | error | debug`
- `since` (string, optional) : ISO timestamp

**Response 200:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "timestamp": "2026-07-26T12:00:00Z",
        "agentId": "CORE-01",
        "action": "transition",
        "details": "Draft → Planned",
        "level": "info",
        "metadata": { "from": "Draft", "to": "Planned" }
      }
    ],
    "total": 1
  }
}
```

---

### 3.6. Prompts

#### Build a prompt

```
POST /api/v1/prompts/build
```

**Request body:**
```json
{
  "agentId": "DEV-04",
  "context": {
    "includeAdr": true,
    "includeRegistry": true,
    "includeRecentLogs": false,
    "includeCapabilities": true,
    "customInstructions": "Focus on security"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "agentId": "DEV-04",
    "system": "You are DevSecOps agent...",
    "context": "Registry: [DEV-04]... ADR: [ADR-005]...",
    "instructions": "Focus on security",
    "full": "[Prompt complet assemblé]"
  }
}
```

#### Test a prompt (execute LLM)

```
POST /api/v1/prompts/test
```

**Request body:**
```json
{
  "prompt": {
    "agentId": "DEV-04",
    "system": "You are DevSecOps agent...",
    "context": "...",
    "instructions": "Analyze this architecture",
    "full": "[Prompt complet]"
  },
  "provider": {
    "type": "openai",
    "model": "gpt-4",
    "temperature": 0.3,
    "maxTokens": 2000
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "content": "[LLM response text]",
    "duration": 2450,
    "tokenUsage": {
      "input": 1200,
      "output": 800,
      "total": 2000
    },
    "model": "gpt-4",
    "provider": "openai"
  }
}
```

#### Save a prompt

```
POST /api/v1/prompts/save
```

**Request body:**
```json
{
  "name": "Security Analysis Prompt",
  "description": "Used for security review of new features",
  "agentId": "DEV-04",
  "prompt": {
    "system": "...",
    "context": "...",
    "instructions": "...",
    "full": "..."
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "prompt-001",
    "name": "Security Analysis Prompt",
    "createdAt": "2026-07-26T12:00:00Z"
  }
}
```

#### List saved prompts

```
GET /api/v1/prompts
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "id": "prompt-001",
        "name": "Security Analysis Prompt",
        "description": "Used for security review",
        "agentId": "DEV-04",
        "createdAt": "2026-07-26T12:00:00Z",
        "updatedAt": "2026-07-26T12:00:00Z"
      }
    ],
    "total": 1
  }
}
```

---

### 3.7. Secrets

#### List secrets (keys only)

```
GET /api/v1/secrets
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "keys": ["OPENAI_API_KEY", "GITHUB_TOKEN"],
    "total": 2
  }
}
```

#### Set a secret

```
POST /api/v1/secrets
```

**Request body:**
```json
{
  "key": "OPENAI_API_KEY",
  "value": "sk-..."
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "key": "OPENAI_API_KEY",
    "createdAt": "2026-07-26T12:00:00Z"
  }
}
```

#### Get a secret

```
GET /api/v1/secrets/:key
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "key": "OPENAI_API_KEY",
    "value": "sk-..."
  }
}
```

#### Delete a secret

```
DELETE /api/v1/secrets/:key
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "key": "OPENAI_API_KEY",
    "deleted": true
  }
}
```

---

### 3.8. Aliases

#### List aliases

```
GET /api/v1/aliases
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "aliases": [
      {
        "name": "st",
        "command": "state transition",
        "description": "Alias for state transition",
        "createdAt": "2026-07-26T10:00:00Z",
        "updatedAt": "2026-07-26T10:00:00Z"
      }
    ],
    "total": 1
  }
}
```

#### Set alias

```
POST /api/v1/aliases
```

**Request body:**
```json
{
  "name": "st",
  "command": "state transition",
  "description": "Alias for state transition"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "name": "st",
    "createdAt": "2026-07-26T12:00:00Z"
  }
}
```

#### Delete alias

```
DELETE /api/v1/aliases/:name
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "name": "st",
    "deleted": true
  }
}
```

---

### 3.9. Doctor

#### Run diagnosis

```
GET /api/v1/doctor/diagnose
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2026-07-26T12:00:00Z",
    "status": "warning",
    "checks": [
      {
        "id": "check-1",
        "name": "Registry integrity",
        "status": "passed",
        "message": "Registry is valid"
      },
      {
        "id": "check-2",
        "name": "State file exists",
        "status": "warning",
        "message": "State file not found",
        "suggestion": "Run `akoris init` to create project state"
      }
    ],
    "summary": {
      "passed": 1,
      "warnings": 1,
      "errors": 0
    }
  }
}
```

#### Run auto-fix

```
POST /api/v1/doctor/fix
```

**Request body:**
```json
{
  "checks": ["check-2"]
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "fixed": 1,
    "failed": 0,
    "fixes": [
      {
        "checkId": "check-2",
        "status": "fixed",
        "message": "State file created at .akoris/state.json"
      }
    ]
  }
}
```

---

## 4. Format de réponse standard

### Succès

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-07-26T12:00:00Z",
    "duration": 42
  }
}
```

### Erreur

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "suggestion": "What the user should do",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2026-07-26T12:00:00Z",
    "duration": 5
  }
}
```

---

## 5. Codes d'erreur

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AGENT_NOT_FOUND` | 404 | Agent introuvable |
| `RULE_NOT_FOUND` | 404 | Règle introuvable |
| `CAPABILITY_NOT_FOUND` | 404 | Capacité introuvable |
| `PROMPT_NOT_FOUND` | 404 | Prompt introuvable |
| `SECRET_NOT_FOUND` | 404 | Secret introuvable |
| `ALIAS_NOT_FOUND` | 404 | Alias introuvable |
| `INVALID_TRANSITION` | 400 | Transition non définie |
| `TRANSITION_DENIED` | 400 | Transition refusée |
| `GATE_FAILED` | 400 | Quality Gate non satisfait |
| `VALIDATION_ERROR` | 400 | Données invalides |
| `LLM_CALL_FAILED` | 502 | Échec appel LLM |
| `INTERNAL_ERROR` | 500 | Erreur interne |

---

## 6. Pagination

Pour les endpoints listant des ressources :

```
GET /api/v1/registry/agents?limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agents": [...],
    "total": 42,
    "limit": 10,
    "offset": 0
  }
}
```

---

## 7. Cohérence avec le Blueprint

- Tous les endpoints suivent les conventions REST (conforme à `02-technical-architecture.md`).
- Les formats de réponse sont standardisés (principe de maintenabilité).
- Les erreurs sont typées et suggèrent une action (principe UX).
- Le contrat API est la base du SDK (`11-sdk.md`).

---

## Statut

- Phase A : ✅ **Complete**
- `04-domain-model.md` : ⏳ À valider
- `05-api-contract.md` : 🔍 **Draft**

**Prochaine action** : Validez ce document pour passer aux événements.
