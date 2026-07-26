---
title: "AKORIS Control Center — Domain Model"
version: "1.0"
status: "Draft"
owner: "AKORIS Core Team"
last-updated: "2026-07-26"
related:
  - "03-core.md"
  - "05-api-contract.md"
  - "06-events.md"
---
# 04 — Domain Model

## 1. Objectif

Ce document définit l'ensemble des **entités métier** manipulées par le Core Engine, leurs attributs, leurs relations et leurs invariants. Toutes les interfaces (API, SDK, événements) s'appuient sur ces définitions.

Les entités sont organisées par domaine fonctionnel :

| Domaine | Entités |
|---------|---------|
| **Gouvernance** | Project, Sprint, Milestone, ADR, Decision |
| **Registry** | Agent, Capability, Contract, Rule, EventDefinition, Deliverable, QualityGate |
| **Exécution** | State, Transition, TransitionHistory, QualityGateResult |
| **Observabilité** | LogEntry, Notification, TimelineEvent |
| **IA** | Prompt, PromptTemplate, PromptContext, LLMProvider, PromptExecution |
| **DevOps** | Secret, Deployment, Environment, ConnectedService, Provider |
| **Système** | Command, Task, Snapshot, ValidationReport |

---

## 2. Entités par domaine

### 2.1. Gouvernance

#### Project
Identité du projet.

```typescript
interface Project {
  id: string;               // UUID
  name: string;
  version: string;          // SemVer
  registryPath: string;     // chemin absolu vers registry/
  createdAt: string;        // ISO 8601
  updatedAt: string;
}
```

#### Sprint
Période de développement.

```typescript
interface Sprint {
  id: string;               // "S-001"
  name: string;
  startDate: string;        // ISO 8601
  endDate: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  objectives: string[];
  completedItems: number;
  totalItems: number;
  velocity?: number;        // points par jour
}
```

#### Milestone
Jalon stratégique.

```typescript
interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'reached' | 'missed';
  requiredGates: string[];  // QG IDs
  responsible: string;      // agentId
}
```

#### ADR (Architecture Decision Record)

```typescript
interface ADR {
  id: string;               // "ADR-001"
  title: string;
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
  date: string;
  author: string;
  context: string;
  decision: string;
  consequences: string[];
  related: string[];        // IDs d'autres ADR
  files: string[];          // fichiers impactés
}
```

#### Decision
Décision de gouvernance (non technique).

```typescript
interface Decision {
  id: string;
  title: string;
  description: string;
  madeBy: string;           // agentId ou role
  date: string;
  status: 'draft' | 'approved' | 'rejected';
  related: string[];        // ADR, Event, etc.
}
```

---

### 2.2. Registry

#### Agent
Un rôle logiciel autonome.

```typescript
interface Agent {
  id: string;               // "CORE-01-Orchestrator"
  name: string;
  domain: 'CORE' | 'DEV' | 'QA' | 'EXP' | 'GOV' | string;
  criticity: 'critique' | 'haute' | 'moyenne' | 'basse';
  status: 'active' | 'inactive' | 'deprecated' | 'draft';
  version: string;          // SemVer
  description: string;
  tags: string[];
  dependencies: AgentDependency[];
  tokenEstimate: number;    // tokens approximatifs pour le prompt
  activatedBy: string[];    // Event IDs
  produces: string[];       // Deliverable IDs
  validates: string[];      // QualityGate IDs
  capabilities: Capability[];
}
```

#### Capability
Une capacité offerte par un agent.

```typescript
interface Capability {
  id: string;               // "design_architecture"
  name: string;
  description: string;
  agentId: string;
  type: 'can' | 'cannot';
}
```

#### Contract
Contrat formel d'un agent (version texte + machine).

```typescript
interface Contract {
  agentId: string;
  version: string;
  mission: string;
  responsibilities: string[];
  limits: string[];
  inputs: ContractIO[];
  outputs: ContractIO[];
  qualityGates: string[];   // QG IDs
  promptTemplate: string;   // prompt.md
  raci: RACI;
}
```

#### Rule
Règle de gouvernance (`if → then`).

```typescript
interface Rule {
  id: string;               // "RULE-042"
  name: string;
  description: string;
  severity: 'bloquante' | 'critique' | 'majeure' | 'mineure' | 'information';
  condition: string;        // expression évaluable
  actions: RuleAction[];
  tags: string[];
}
```

#### EventDefinition
Événement déclencheur.

```typescript
interface EventDefinition {
  id: string;               // "EVT-007"
  name: string;
  description: string;
  phase: string;            // phase du cycle de vie
  triggers: string[];       // Workflow IDs
}
```

#### Deliverable
Artefact produit ou consommé.

```typescript
interface Deliverable {
  id: string;               // "DEL-013"
  name: string;
  type: 'documentation' | 'code' | 'configuration' | 'rapport' | 'plan' | 'specification' | 'audit';
  description: string;
  mandatory: boolean;
  producedBy: string[];     // Agent IDs
  consumedBy: string[];     // Agent IDs
  qualityGates: string[];   // QG IDs
}
```

#### QualityGate
Point de contrôle.

```typescript
interface QualityGate {
  id: string;               // "QG-018"
  name: string;
  description: string;
  severity: 'bloquante' | 'critique' | 'majeure' | 'mineure';
  owner: string;            // Agent ID
  criteria: GateCriteria[];
  threshold: number;        // score minimum (0-1)
  controls: string[];       // Transition IDs
}
```

---

### 2.3. Exécution

#### State
État du projet.

```typescript
interface State {
  id: string;               // "DRAFT"
  name: string;
  phase: string;
  description: string;
}
```

#### Transition
Déplacement entre deux états.

```typescript
interface Transition {
  from: string;             // State ID
  to: string;               // State ID
  requiredGates: string[];  // QG IDs
  authorizedBy: string[];   // Agent IDs ou rôles
  description: string;
}
```

#### TransitionHistory
Enregistrement d'une transition exécutée.

```typescript
interface TransitionHistory {
  id: string;               // UUID
  from: string;
  to: string;
  at: string;               // ISO 8601
  authorizedBy: string;     // Agent ID
  gatesStatus: GateResult[];
  comment?: string;
}
```

#### QualityGateResult
Résultat d'un Quality Gate.

```typescript
interface GateResult {
  gateId: string;
  status: 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';
  score: number;
  details: string;
  evaluatedAt: string;
}
```

---

### 2.4. Observabilité

#### LogEntry
Entrée de log.

```typescript
interface LogEntry {
  timestamp: string;        // ISO 8601
  agentId: string;
  action: string;
  details: string;
  metadata?: Record<string, unknown>;
}
```

#### Notification
Alerte ou message.

```typescript
interface Notification {
  id: string;               // UUID
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;            // URL vers la ressource concernée
}
```

#### TimelineEvent
Événement de la frise chronologique.

```typescript
interface TimelineEvent {
  id: string;
  type: 'state_transition' | 'adr_created' | 'sprint_started' | 'deployment' | 'audit' | 'gate_passed' | 'gate_failed';
  timestamp: string;
  actor: string;            // Agent ID
  payload: Record<string, unknown>;
}
```

---

### 2.5. IA

#### Prompt
Instruction structurée pour un LLM.

```typescript
interface Prompt {
  id: string;               // UUID
  name: string;
  template: string;
  agentId: string;          // Agent ciblé
  context: PromptContext;
  variables: Record<string, string>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    llmProvider?: string;
    tokens?: number;
  };
}
```

#### PromptTemplate
Modèle de prompt réutilisable.

```typescript
interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  defaultContext: PromptContext;
  tags: string[];
}
```

#### PromptContext
Contexte injecté dans le prompt.

```typescript
interface PromptContext {
  includeRegistry: boolean;
  includeADR: boolean;
  includeState: boolean;
  includeLogs: boolean;
  includeStandards: boolean;
  includeArchitecture: boolean;
  includeSprint: boolean;
  custom?: Record<string, unknown>;
}
```

#### LLMProvider
Fournisseur de modèle de langage.

```typescript
interface LLMProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  model: string;
  maxTokens: number;
  costPer1kTokens: number;
}
```

#### PromptExecution
Enregistrement d'une exécution.

```typescript
interface PromptExecution {
  id: string;
  promptId: string;
  provider: string;
  input: string;
  output: string;
  tokensUsed: number;
  cost: number;
  durationMs: number;
  timestamp: string;
  status: 'success' | 'error';
}
```

---

### 2.6. DevOps

#### Secret
Token ou clé chiffrée.

```typescript
interface Secret {
  key: string;              // "GITHUB_TOKEN"
  value: string;            // chiffré
  provider: string;         // "github" | "supabase" | "vercel" | "netlify" | "openai" | "anthropic"
  createdAt: string;
  updatedAt: string;
}
```

#### Environment
Environnement de déploiement.

```typescript
interface Environment {
  id: string;               // "staging"
  name: string;
  type: 'staging' | 'production' | 'development';
  url: string;
  status: 'idle' | 'deploying' | 'deployed' | 'failed';
  lastDeployedAt?: string;
}
```

#### Deployment
Enregistrement d'un déploiement.

```typescript
interface Deployment {
  id: string;               // UUID
  environment: string;
  version: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  startedAt: string;
  finishedAt?: string;
  logs: string[];
  triggeredBy: string;      // Agent ID
}
```

#### ConnectedService
Service externe connecté.

```typescript
interface ConnectedService {
  id: string;               // "github"
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: string;
}
```

---

### 2.7. Système

#### Command
Commande CLI exécutable.

```typescript
interface Command {
  id: string;               // "state transition"
  description: string;
  options: CommandOption[];
  examples: string[];
}
```

#### Task
Tâche unitaire.

```typescript
interface Task {
  id: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  assignedTo: string;       // Agent ID
  dependsOn: string[];      // Task IDs
}
```

#### Snapshot
Capture de l'état du projet à un instant T.

```typescript
interface Snapshot {
  id: string;               // UUID
  timestamp: string;
  state: string;            // état du projet
  registryVersion: string;
  metrics: {
    healthScore: number;
    coverage: number;
    technicalDebt: number;
  };
  history: TransitionHistory[];
}
```

#### ValidationReport
Rapport de validation du Registry.

```typescript
interface ValidationReport {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  checkedAt: string;
}
```

---

## 3. Relations entre entités

| Source | Relation | Cible | Cardinalité |
|--------|----------|-------|-------------|
| Agent | `dependsOn` | Agent | 0..* |
| Agent | `produces` | Deliverable | 0..* |
| Agent | `validates` | QualityGate | 0..* |
| Agent | `activatedBy` | EventDefinition | 0..* |
| Agent | `hasCapability` | Capability | 0..* |
| Agent | `hasContract` | Contract | 1 |
| QualityGate | `controls` | Transition | 1..* |
| Transition | `requires` | QualityGate | 0..* |
| EventDefinition | `triggers` | Workflow | 0..* |
| Prompt | `usesAgent` | Agent | 1 |
| Prompt | `usesProvider` | LLMProvider | 1 |
| PromptExecution | `references` | Prompt | 1 |
| Deployment | `targets` | Environment | 1 |
| Secret | `belongsTo` | ConnectedService | 1 |
| Rule | `enforces` | Agent | 0..* |

---

## 4. Invariants (contraintes d'intégrité)

1. **Unicité des IDs** : Chaque entité possède un ID unique dans son contexte.
2. **Références valides** : Toute référence à un ID doit pointer vers une entité existante.
3. **Transitions valides** : Une transition ne peut être exécutée que si elle est définie dans `state-machine.json`.
4. **Quality Gates requis** : Une transition ne peut être exécutée que si tous les gates requis sont `PASS`.
5. **Agent actif** : Un agent ne peut être activé que si ses dépendances sont actives.
6. **Prompt valide** : Un prompt doit avoir un agent et un LLMProvider définis.
7. **Secret chiffré** : Les secrets sont toujours stockés chiffrés (AES-256-GCM).

---

## 5. Prochaine étape

Avec ce modèle de domaine, les documents suivants (`05-api-contract.md`, `06-events.md`, `07-websocket.md`, `11-sdk.md`) peuvent définir précisément les interfaces (endpoints, événements, WebSocket, client) qui manipulent ces entités.
