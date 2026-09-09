export type Domain = 'CORE' | 'DEV' | 'QA' | 'EXP' | 'GOV';
export type Criticity = 'critique' | 'haute' | 'moyenne' | 'basse';
export type AgentStatus = 'active' | 'inactive' | 'deprecated' | 'draft';

import type { PersistenceError, TransitionError, VersionConflictError } from './errors.js';

export interface AgentDependency {
  agentId: string;
  type: 'mandatory' | 'optional';
  description?: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  type: 'can' | 'cannot';
}

export interface Agent {
  id: string;
  name: string;
  version: string;
  domain: Domain;
  criticity: Criticity;
  status: AgentStatus;
  mission: string;
  responsibilities: string[];
  limits: string[];
  dependencies: AgentDependency[];
  capabilities: Capability[];
}

export interface RegistryIndex {
  version: string;
  agentCount: number;
  domains: string[];
  lastUpdated: string;
}

export interface AgentFilter {
  domain?: string;
  status?: string;
  criticity?: string;
  tag?: string;
}

export interface ValidationIssue {
  id: string;
  severity: 'warning' | 'error';
  category: 'cycle' | 'missing-dependency' | 'inactive-reference';
  message: string;
  agentId: string;
  relatedAgentId?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  agent: string;
  message: string;
  details?: Record<string, unknown>;
}

export type AkorisEvent =
  | { type: 'log:entry'; payload: LogEntry }
  | {
      type: 'state:transition';
      payload: {
        id: string;
        from: string;
        to: string;
        at: string;
        authorizedBy: string[];
        comment?: string;
      };
    };

// --- §4.2 State Machine ---

export interface State {
  id: string;
  name?: string;
  label?: string;
  phase?: string;
  description?: string;
}

export interface TransitionDef {
  id?: string;
  from: string;
  to: string;
  requires: string[];
  authorizedBy: string[];
  required: boolean;
}

export interface StateMachine {
  version: string;
  schema?: string;
  initialState: string;
  terminalStates: string[];
  states: State[];
  transitions: TransitionDef[];
  exceptionStates?: {
    [key: string]: {
      from: string[];
      to: string[];
    };
  };
}

// --- §4.14 AuthorizationContext ---

export interface AuthorizationContext {
  actorId: string;
  actorType: 'human' | 'artificial' | 'system';
  roles: string[];
  decisionRef?: string;
  authenticatedAt?: string;
}

// --- §4.3 Evidence (E1) et historique ---

export interface EvidenceE1 {
  id: string;
  level: 'E1';
  type: 'transition-hash';
  artifactRef: string;
  author: string;
  timestamp: string;
  source: string;
  algorithm: 'SHA-256';
  hash: string;
  previousHash?: string;
  canonicalPayloadVersion: '1';
  createdAt: string;
}

export interface TransitionHistoryItem {
  id: string;
  from: string;
  to: string;
  at: string;
  authorizedBy: AuthorizationContext;
  comment?: string;
  evidence: EvidenceE1;
}

export interface TransitionResult {
  transitionId: string;
  newState: string;
  history: TransitionHistoryItem;
  gateEvaluations: GateEvaluation[];
  persistedVersion: number;
}

export interface StatePersistence {
  current: string;
  history: TransitionHistoryItem[];
  machineVersion: string;
}

// --- §4.4 Quality Gates ---

export type GateStatusValue = 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';

export interface CriterionDefinition {
  id: string;
  name: string;
  evaluator: string;
  params: Record<string, unknown>;
  weight: number;
}

export interface GateDefinition {
  id: string;
  version: string;
  criteria: CriterionDefinition[];
  evaluatorIds: string[];
  requiredEvidenceLevels: ('E1' | 'E2' | 'E3')[];
  blocking: boolean;
  threshold?: number;
}

export interface GateContext {
  currentState: string;
  history: TransitionHistoryItem[];
  logs: LogEntry[];
  artifact?: Record<string, unknown>;
}

export interface CriterionResult {
  criterionId: string;
  status: 'PASS' | 'FAIL';
  score: number;
  details: string;
}

export interface GateEvaluation {
  gateId: string;
  gateVersion: string;
  status: GateStatusValue;
  criterionResults: CriterionResult[];
  evidenceRefs: string[];
  evaluatedAt: string;
}

export interface GateEvaluator {
  id: string;
  evaluate(ctx: GateContext, params: Record<string, unknown>): { status: 'PASS' | 'FAIL'; score: number; details: string };
}

// --- §4.12 ProjectStore / Snapshot ---

export interface EncryptedSecret {
  key: string;
  ciphertext: string;
  nonce: string;
  salt: string;
  tag: string;
  formatVersion: '1';
  createdAt: string;
  updatedAt: string;
}

export interface Alias {
  name: string;
  command: string;
  description: string;
}

export interface FullSnapshot {
  version: number;
  machineVersion: string;
  instanceId: string;
  state: StatePersistence;
  logs: LogEntry[];
  secrets: EncryptedSecret[];
  aliases: Alias[];
  templates: PromptTemplate[];
  checksum: string;
  savedAt: string;
}

export interface PromptVariableDef {
  key: string;
  label: string;
  source: 'agent' | 'state' | 'logs' | 'system';
  required?: boolean;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  template: string;
  variables: PromptVariableDef[];
  createdAt: string;
  updatedAt: string;
}

export interface SnapshotPersister {
  saveSnapshotIfVersion(
    expectedVersion: number,
    snapshot: FullSnapshot,
  ): Promise<{ success: true } | { success: false; currentVersion: number; error: 'CONFLICT' }>;
  loadSnapshot(): Promise<FullSnapshot | null>;
}

// --- §4.13 TransitionOutcome et TransitionContext ---

export type TransitionOutcome =
  | { status: 'committed'; result: TransitionResult }
  | { status: 'rejected'; error: TransitionError }
  | { status: 'persistence-failed'; error: PersistenceError }
  | { status: 'conflict'; error: VersionConflictError };

export interface TransitionContext {
  from: string;
  to: string;
  authorizedBy: AuthorizationContext;
  comment?: string;
  artifact?: Record<string, unknown>;
}
