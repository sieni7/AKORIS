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
  - "ADR-003-core-first.md"
---

# 04 — Domain Model

## 1. Objectif

Ce document définit les **entités métier** du Core Engine. Chaque entité est modélisée en TypeScript et correspond à un concept du domaine AKORIS. Ces types sont partagés entre le Core, l'API, le SDK et le Dashboard via `packages/shared`.

---

## 2. Entités principales

### 2.1. Agent

```typescript
interface Agent {
  id: string;                    // e.g. "DEV-04"
  name: string;                  // e.g. "DevSecOps"
  domain: string;                // e.g. "development"
  status: 'active' | 'inactive' | 'draft';
  rules: string[];               // IDs des règles associées
  capabilities: string[];        // IDs des capacités
  tags: string[];
  description?: string;
  promptTemplate?: string;       // Template de prompt par défaut
  metadata?: Record<string, unknown>;
}
```

### 2.2. Rule

```typescript
interface Rule {
  id: string;                    // e.g. "R-001"
  name: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  scope: string;                 // Domaine d'application
  condition?: string;            // Condition d'évaluation
  tags: string[];
}
```

### 2.3. Capability

```typescript
interface Capability {
  id: string;                    // e.g. "C-014"
  name: string;
  description: string;
  agentId: string;               // Agent porteur
  type: 'skill' | 'knowledge' | 'tool' | 'process';
  status: 'available' | 'deprecated' | 'experimental';
}
```

### 2.4. Deliverable

```typescript
interface Deliverable {
  id: string;                    // e.g. "D-003"
  name: string;
  type: 'document' | 'code' | 'config' | 'test' | 'other';
  path?: string;                 // Chemin relatif dans le projet
  milestone?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}
```

### 2.5. QualityGate

```typescript
interface QualityGate {
  id: string;                    // e.g. "QG-01"
  name: string;
  description: string;
  transitions: { from: string; to: string }[];  // Transitions concernées
  checks: GateCheck[];          // Vérifications à effectuer
}

interface GateCheck {
  id: string;
  type: 'file_exists' | 'file_content' | 'rule_passed' | 'custom';
  target: string;                // Fichier, règle, ou script
  description: string;
}
```

### 2.6. ProjectState

```typescript
interface ProjectState {
  current: string;               // État courant (e.g. "Draft")
  available: string[];           // États disponibles dans la machine
  history: TransitionRecord[];
  lastUpdated: string;           // ISO timestamp
}

interface TransitionRecord {
  from: string;
  to: string;
  timestamp: string;
  actor?: string;
  gatesPassed: string[];
  gatesFailed?: { gateId: string; reason: string }[];
}

interface TransitionCheck {
  allowed: boolean;
  gatesRequired: string[];
  gatesPassed: string[];
  gatesFailed?: { gateId: string; reason: string }[];
  reason?: string;
}

interface TransitionResult {
  success: boolean;
  from: string;
  to: string;
  timestamp: string;
  gatesPassed: string[];
  gatesFailed?: { gateId: string; reason: string }[];
  error?: string;
}
```

### 2.7. StateMachine

```typescript
interface StateMachine {
  states: StateDefinition[];
  transitions: TransitionDefinition[];
}

interface StateDefinition {
  id: string;                    // e.g. "Draft"
  name: string;
  description?: string;
  color?: string;                // Pour l'affichage Dashboard
}

interface TransitionDefinition {
  from: string;
  to: string;
  gates: string[];               // QG requis
  description?: string;
}
```

### 2.8. LogEntry

```typescript
interface LogEntry {
  timestamp: string;             // ISO 8601
  agentId: string;
  action: string;
  details: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  metadata?: Record<string, unknown>;
}
```

### 2.9. Prompt

```typescript
interface Prompt {
  id?: string;
  name: string;
  agentId: string;
  system: string;                // System prompt
  context: PromptContext;        // Contexte assemblé
  instructions: string;          // User prompt
  full: string;                  // Prompt complet
  createdAt?: string;
  updatedAt?: string;
}

interface PromptContext {
  includeAdr: boolean;
  includeRegistry: boolean;
  includeRecentLogs: boolean;
  includeCapabilities: boolean;
  customInstructions?: string;
}

interface PromptInput {
  agentId: string;
  context: PromptContext;
}

interface LLMResponse {
  content: string;
  duration: number;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
  model: string;
  provider: string;
}

interface LLMProvider {
  type: 'openai' | 'anthropic';
  model: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}
```

### 2.10. Alias

```typescript
interface Alias {
  name: string;
  command: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2.11. Secret

```typescript
interface Secret {
  key: string;
  createdAt: string;
  updatedAt: string;
  // La valeur n'est jamais exposée dans l'interface
}
```

### 2.12. RegistryIndex

```typescript
interface RegistryIndex {
  agents: Agent[];
  rules: Rule[];
  capabilities: Capability[];
  deliverables: Deliverable[];
  qualityGates: QualityGate[];
  events: RegistryEvent[];
  lastUpdated: string;
}

interface RegistryEvent {
  id: string;
  name: string;
  description: string;
  agentId: string;
}
```

### 2.13. SearchResult

```typescript
interface SearchResult {
  type: 'agent' | 'rule' | 'capability' | 'deliverable' | 'adr' | 'log' | 'prompt' | 'event';
  id: string;
  title: string;
  description?: string;
  match: string;                 // Extrait du texte correspondant
  score: number;                 // Pertinence (0-1)
}

interface SearchOptions {
  types?: SearchResult['type'][];
  limit?: number;
  fuzzy?: boolean;
}

interface SearchFilters {
  types?: SearchResult['type'][];
  tags?: string[];
  agents?: string[];
  dateFrom?: string;
  dateTo?: string;
}
```

### 2.14. Diagnosis / Fix

```typescript
interface DiagnosisReport {
  timestamp: string;
  status: 'healthy' | 'warning' | 'error';
  checks: CheckResult[];
  summary: {
    passed: number;
    warnings: number;
    errors: number;
  };
}

interface CheckResult {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

interface FixReport {
  fixed: number;
  failed: number;
  fixes: FixResult[];
}

interface FixResult {
  checkId: string;
  status: 'fixed' | 'failed' | 'skipped';
  message: string;
}
```

---

## 3. Relations entre entités

```
Agent ──1:N──> Rule (via agent.rules)
Agent ──1:N──> Capability (via agent.capabilities)
Agent ──1:N──> RegistryEvent
Agent ──1:N──> LogEntry (via entry.agentId)
Agent ──1:N──> Prompt (via prompt.agentId)

QualityGate ──N:M──> TransitionDefinition (via transition.gates)
QualityGate ──1:N──> GateCheck

ProjectState ──1:N──> TransitionRecord
StateMachine ──1:N──> StateDefinition
StateMachine ──1:N──> TransitionDefinition
```

---

## 4. Validation (Zod schemas)

Chaque entité a son schéma Zod correspondant dans `packages/shared/src/schemas/`. Exemple :

```typescript
// packages/shared/src/schemas/agent.ts
import { z } from 'zod';

export const AgentSchema = z.object({
  id: z.string().regex(/^[A-Z]+-\d{2,3}$/),
  name: z.string().min(1).max(100),
  domain: z.string(),
  status: z.enum(['active', 'inactive', 'draft']),
  rules: z.array(z.string()),
  capabilities: z.array(z.string()),
  tags: z.array(z.string()),
  description: z.string().optional(),
  promptTemplate: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type Agent = z.infer<typeof AgentSchema>;
```

---

## 5. Cohérence avec le Blueprint

- Toutes les entités sont définies en TypeScript (conforme à `02-technical-architecture.md`).
- Les entités sont partagées via `packages/shared` (principe DRY).
- Les schémas Zod assurent la validation au runtime (cohérence Core/API).
- Les relations reflètent la structure du Registry existant.

---

## Statut

- Phase A : ✅ **Complete**
- `04-domain-model.md` : 🔍 **Draft**

**Prochaine action** : Validez ce document pour passer au contrat API.
