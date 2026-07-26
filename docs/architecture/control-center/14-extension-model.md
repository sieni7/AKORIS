---
title: "AKORIS Control Center — Extension Model"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "00-vision.md"
  - "03-core.md"
  - "ADR-006-extension-model.md"
---
# 14 — Extension Model

## 1. Objectif

Ce document définit comment AKORIS Control Center peut être **étendu** sans modifier le cœur du système. L'objectif est de permettre l'ajout de :

- Nouveaux modules (ex: Analytics, Monitoring).
- Nouveaux agents (ex: DATA-01-Data-Engineer).
- Nouveaux providers LLM (ex: Mistral, Gemini).
- Nouveaux providers DevOps (ex: AWS, DigitalOcean).
- Nouvelles interfaces (ex: TUI, extension VS Code).

---

## 2. Principes d'extensibilité

1. **Le Core est fermé à la modification, ouvert à l'extension** (Open/Closed Principle).
2. **Toute extension se fait via des interfaces publiques** (API, SDK, événements).
3. **Les extensions sont découvertes automatiquement** (scan du Registry ou configuration).
4. **Les extensions sont versionnées** et testées indépendamment.

---

## 3. Types d'extensions

| Type | Description | Point d'extension |
|------|-------------|-------------------|
| **Module** | Nouveau contexte métier | Route API + page Dashboard |
| **Agent** | Nouvel agent AKORIS | Fichier agent.json dans `registry/agents/` |
| **LLM Provider** | Nouveau modèle de langage | Implémentation de `LLMProvider` dans le Core |
| **DevOps Provider** | Nouveau service externe | Implémentation de `DeployProvider` + SecretManager |
| **Interface** | Nouvelle couche de présentation | SDK + API |

---

## 4. Extension des modules (nouveau contexte)

### 4.1. Ajouter un module

**Étapes :**
1. Ajouter une route dans l'API (`apps/api/src/routes/module-name/`).
2. Ajouter une page dans le Dashboard (`apps/dashboard/src/routes/module-name/`).
3. Ajouter un service dans le Core (`packages/core/src/module-name/`).
4. Mettre à jour la navigation (sidebar).

**Règle** : Le module doit être auto-contenu et ne pas dépendre d'autres modules (sauf du Core).

---

## 5. Extension des agents

### 5.1. Ajouter un agent

Un agent est ajouté en créant un dossier dans `registry/agents/` avec l'ID `{DOMAINE}-{NN}-{Nom}` et le fichier `agent.json` (conforme au schéma).

**Exemple :**
```json
{
  "id": "DATA-01-Data-Engineer",
  "name": "Data Engineer",
  "domain": "DATA",
  "criticity": "moyenne",
  "status": "active",
  "description": "Agent spécialisé en traitement de données.",
  "tags": ["data", "etl", "analytics"],
  "dependencies": [{ "agentId": "CORE-04-Database-Architect", "type": "mandatory" }],
  "capabilities": [
    { "id": "design_etl_pipeline", "name": "Concevoir un pipeline ETL" },
    { "id": "data_quality_check", "name": "Vérifier la qualité des données" }
  ]
}
```

**Détection automatique** : Le RegistryReader scanne le dossier `registry/agents/` à chaque démarrage.

---

## 6. Extension des providers LLM

### 6.1. Ajouter un provider

**Interface à implémenter :**
```typescript
// packages/core/src/llm-provider.interface.ts

export interface LLMProvider {
  id: string;
  name: string;
  defaultModel: string;
  maxTokens: number;
  costPer1kTokens: number;

  execute(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
}
```

**Exemple d'extension (Mistral) :**
```typescript
// packages/contrib/llm-mistral/src/index.ts

export class MistralProvider implements LLMProvider {
  id = 'mistral';
  name = 'Mistral';
  defaultModel = 'mistral-large-latest';
  maxTokens = 8192;
  costPer1kTokens = 0.002;

  async execute(prompt: string): Promise<LLMResponse> {
    // Appel à l'API Mistral
  }
}
```

**Découverte** : Le Provider est enregistré via le `SecretManager` (clé API) et le Core le charge dynamiquement.

---

## 7. Extension des providers DevOps

### 7.1. Ajouter un provider

**Interface à implémenter :**
```typescript
// packages/core/src/deploy-provider.interface.ts

export interface DeployProvider {
  id: string;
  name: string;
  environments: string[]; // staging, production

  deploy(environment: string, version: string, config: DeployConfig): Promise<Deployment>;
  getStatus(deploymentId: string): Promise<DeploymentStatus>;
}
```

**Exemple d'extension (AWS) :**
```typescript
// packages/contrib/deploy-aws/src/index.ts

export class AWSProvider implements DeployProvider {
  id = 'aws';
  name = 'AWS';
  environments = ['staging', 'production'];

  async deploy(environment: string, version: string): Promise<Deployment> {
    // Appel à l'API AWS (EC2, ECS, etc.)
  }
}
```

---

## 8. Extension des interfaces (TUI, VS Code)

### 8.1. Client SDK

Toute nouvelle interface doit utiliser le SDK (`packages/sdk`) pour communiquer avec l'API.

**Exemple d'extension CLI (TUI) :**
```typescript
// apps/tui/src/index.ts

import { AKORISClient } from '@akoris/sdk';

const client = new AKORISClient({ baseUrl: 'http://localhost:3000/api/v1' });
const health = await client.getHealth();
console.log(`Health Score: ${health.healthScore}`);
```

**Règle** : Une nouvelle interface ne doit JAMAIS appeler le Core directement ; elle doit passer par l'API.

---

## 9. Contribution et validation des extensions

- **Les extensions** sont des packages séparés, publiés sur npm (scoped `@akoris/contrib-xxx`).
- **Validation** : chaque extension doit :
  - Passer les tests (unitaires + intégration).
  - Être documentée (README, exemples).
  - Avoir un versionnement SemVer.
  - Être testée avec la dernière version du Core.

---

## 10. Prochaine étape

Après l'extension model, les ADR finales formalisent les choix structurants du projet.
