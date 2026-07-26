---
title: "AKORIS Control Center — API Contract"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "04-domain-model.md"
  - "06-events.md"
  - "07-websocket.md"
  - "11-sdk.md"
---
# 05 — API Contract

## 1. Objectif

Ce document définit le contrat de l'API REST exposée par `apps/api`. L'API est une **façade** qui délègue toute la logique métier au Core Engine. Elle ne contient **aucune** règle métier.

**Conventions :**
- Base URL : `/api/v1`
- Format : JSON
- Dates : ISO 8601 UTC (format `YYYY-MM-DDThh:mm:ssZ`)
- IDs : `kebab-case` pour les identifiants lisibles, UUID pour les identifiants techniques.
- Codes HTTP : 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 500 (Internal Server Error).

**Structure de réponse standard :**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "version": "1.0.0",
    "timestamp": "2026-07-26T14:30:00Z"
  }
}
```

**Structure d'erreur :**
```json
{
  "success": false,
  "errors": [
    {
      "code": "STATE_TRANSITION_DENIED",
      "message": "Transition impossible.",
      "suggestion": "Exécutez les Quality Gates QG-004 et QG-005.",
      "details": {}
    }
  ]
}
```

---

## 2. Endpoints par module

### 2.1. Health

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/health` | Retourne l'état du projet et l'IHG (Indice de Santé Global). |

**Exemple de réponse :**
```json
{
  "success": true,
  "data": {
    "healthScore": 82,
    "status": "good",
    "trend": "+3",
    "components": {
      "tests": 90,
      "documentation": 85,
      "security": 75,
      "performance": 80,
      "technicalDebt": 70
    }
  }
}
```

### 2.2. State

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/state/machine` | Retourne la machine à états complète. |
| `GET` | `/state/current` | Retourne l'état courant du projet. |
| `GET` | `/state/history` | Retourne l'historique des transitions. |
| `POST` | `/state/transition` | Exécute une transition. |
| `GET` | `/state/export` | Exporte l'état en Markdown/JSON. |

**`POST /state/transition`**
Body :
```json
{
  "from": "DRAFT",
  "to": "PLANNED",
  "comment": "Prêt pour la planification"
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "newState": "PLANNED",
    "history": { ... },
    "gatesStatus": [
      { "gateId": "QG-001", "status": "PASS" }
    ]
  }
}
```

### 2.3. Registry

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/registry/index` | Index complet du Registry. |
| `GET` | `/registry/agents` | Liste des agents (filtres : domain, status). |
| `GET` | `/registry/agents/:id` | Détail d'un agent (contrat, capacités, dépendances). |
| `GET` | `/registry/rules` | Liste des règles. |
| `GET` | `/registry/events` | Liste des événements. |
| `GET` | `/registry/deliverables` | Liste des livrables. |
| `GET` | `/registry/quality-gates` | Liste des Quality Gates. |
| `POST` | `/registry/validate` | Valide l'intégrité du Registry. |

**`GET /registry/agents?domain=CORE&status=active`**
Réponse :
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "CORE-01-Orchestrator",
        "name": "Orchestrateur",
        "domain": "CORE",
        "status": "active",
        "criticity": "critique"
      }
    ],
    "count": 8
  }
}
```

### 2.4. Search

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/search` | Recherche fédérée (query param : `q`, `type`, `limit`). |

**Exemple : `GET /search?q=database&type=agent&limit=10`**
Réponse :
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "agent",
        "id": "CORE-04-Database-Architect",
        "score": 0.95,
        "preview": "Database Architect — design_database, optimize_sql"
      }
    ]
  }
}
```

### 2.5. Prompts

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/prompts/build` | Construit un prompt à partir d'un agent et d'un contexte. |
| `POST` | `/prompts/execute` | Exécute un prompt sur un LLM. |
| `GET` | `/prompts/library` | Liste les prompts sauvegardés. |
| `POST` | `/prompts/library` | Sauvegarde un prompt. |
| `PUT` | `/prompts/library/:id` | Met à jour un prompt. |
| `DELETE` | `/prompts/library/:id` | Supprime un prompt. |

**`POST /prompts/build`**
Body :
```json
{
  "agentId": "DEV-04-Frontend-Developer",
  "context": {
    "includeRegistry": true,
    "includeADR": true,
    "includeLogs": false
  },
  "variables": {
    "task": "Implement authentication component"
  }
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "prompt": "You are a Frontend Developer...",
    "tokens": 345
  }
}
```

### 2.6. Secrets

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/secrets` | Liste les clés de secrets. |
| `POST` | `/secrets` | Définit un secret. |
| `GET` | `/secrets/:key` | Récupère un secret (déchiffré). |
| `DELETE` | `/secrets/:key` | Supprime un secret. |
| `POST` | `/secrets/validate` | Valide un secret (ex: token GitHub valide). |

**`POST /secrets`**
Body :
```json
{
  "key": "GITHUB_TOKEN",
  "value": "ghp_xxxxx",
  "provider": "github"
}
```

Réponse :
```json
{
  "success": true,
  "data": { "key": "GITHUB_TOKEN", "status": "connected" }
}
```

### 2.7. DevOps

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/devops/services` | Liste des services connectés (statut). |
| `POST` | `/devops/deploy` | Lance un déploiement. |
| `GET` | `/devops/deployments` | Liste des déploiements récents. |
| `GET` | `/devops/github-actions` | Liste des workflows GitHub Actions. |

**`POST /devops/deploy`**
Body :
```json
{
  "environment": "staging",
  "version": "1.3.0"
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "deploymentId": "dep_123",
    "status": "running",
    "logs": ["Déploiement démarré..."]
  }
}
```

### 2.8. Logs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/logs` | Lit les logs (filtres : `lines`, `agent`, `since`). |

**Exemple : `GET /logs?lines=50&agent=CORE-01`**
Réponse :
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "timestamp": "2026-07-26T14:30:00Z",
        "agentId": "CORE-01",
        "action": "transition",
        "details": "Draft → Planned"
      }
    ],
    "count": 1
  }
}
```

### 2.9. Doctor

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/doctor` | Diagnostique le projet. |
| `POST` | `/doctor/fix` | Répare automatiquement. |

**`POST /doctor/fix`**
Réponse :
```json
{
  "success": true,
  "data": {
    "fixed": true,
    "fixes": [
      "Dossier .akoris/ créé (8 sous-dossiers)",
      "manifest.json créé avec les valeurs par défaut",
      "state.json créé avec l'état DRAFT"
    ]
  }
}
```

### 2.10. Notifications

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/notifications` | Liste les notifications. |
| `PUT` | `/notifications/:id/read` | Marque comme lue. |
| `DELETE` | `/notifications/:id` | Supprime une notification. |

---

## 3. Versionnage

L'API est versionnée via l'URL : `/api/v1/...`. Une nouvelle version majeure (incompatible) incrémentera le numéro.

---

## 4. Prochaine étape

Avec ce contrat d'API, les documents `06-events.md` (événements), `07-websocket.md` (WebSocket) et `11-sdk.md` (client TypeScript) peuvent être définis pour assurer une communication cohérente entre l'API et le Dashboard.
