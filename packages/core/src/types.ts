import type {
  PersistenceError,
  TransitionError,
  VersionConflictError,
} from './errors.js';

export interface Agent {
  id: string;
  name: string;
  version: string;
  domain: 'CORE' | 'DEV' | 'QA' | 'EXP' | 'GOV';
  criticity: 'critique' | 'haute' | 'moyenne' | 'basse';
  status: 'active' | 'inactive' | 'deprecated' | 'draft';
  mission: string;
  responsibilities: string[];
  limits: string[];
  dependencies: AgentDependency[];
  capabilities: Capability[];
}

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

export interface State {
  id: string;
  name: string;
  phase: string;
  description: string;
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
  initialState: string;
  terminalStates: string[];
  states: State[];
  transitions: TransitionDef[];
  exceptionStates: {
    [key: string]: {
      from: string[];
      to: string[];
    };
  };
}

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

export type GateStatusValue = 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';

export interface GateDefinition {
  id: string;
  version: string;
  criteria: CriterionDefinition[];
  evaluatorIds: string[];
  requiredEvidenceLevels: ('E1' | 'E2' | 'E3')[];
  blocking: boolean;
  threshold?: number;
}

export interface CriterionDefinition {
  id: string;
  name: string;
  evaluator: string;
  params: Record<string, unknown>;
  weight: number;
}

export interface GateContext {
  currentState: string;
  history: TransitionHistoryItem[];
  logs: LogEntry[];
}

export interface GateEvaluation {
  gateId: string;
  gateVersion: string;
  status: 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';
  criterionResults: CriterionResult[];
  evidenceRefs: string[];
  evaluatedAt: string;
}

export interface CriterionResult {
  criterionId: string;
  status: 'PASS' | 'FAIL';
  score: number;
  details: string;
}

export interface GateEvaluator {
  id: string;
  evaluate(ctx: GateContext, params: Record<string, unknown>): { status: 'PASS' | 'FAIL'; score: number; details: string };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  agent: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface LogFilter {
  lines?: number;
  agent?: string;
  level?: LogEntry['level'];
  since?: string;
}

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

export interface Secret {
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alias {
  name: string;
  command: string;
  description: string;
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

export interface ResolvedPrompt {
  templateId: string;
  templateName: string;
  original: string;
  resolved: string;
  variables: Record<string, string>;
  tokenEstimate: number;
}

export interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  latencyMs: number;
  timestamp: string;
}

export interface LLMProvider {
  name: string;
  generate(request: LLMRequest): Promise<LLMResponse>;
  stream?(request: LLMRequest): AsyncIterable<string>;
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

export interface SearchQuery {
  q: string;
  type?: 'agent' | 'capability' | 'tag';
  limit?: number;
}

export interface SearchResult {
  agents: Agent[];
  count: number;
  query: SearchQuery;
}

export interface DoctorIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
  fixActionId?: string;
}

export interface DoctorContext {
  logs: LogEntry[];
  history: TransitionHistoryItem[];
  currentState: string;
  secretsCount: number;
  agentsCount: number;
}

export interface FixReport {
  fixed: string[];
  failed: string[];
}

export type DoctorFixAction = (issueId: string) => Promise<boolean>;

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

export interface ProjectStore {
  saveSnapshotIfVersion(
    expectedVersion: number,
    snapshot: FullSnapshot
  ): Promise<{ success: true } | { success: false; currentVersion: number; error: 'CONFLICT' }>;

  loadSnapshot(): Promise<FullSnapshot | null>;
}

// Inférence (D1) : §8.2 liste SnapshotPersister comme API stable mais §2/§4 ne
// fixent pas sa forme exacte. Interface minimale cohérente avec ProjectStore.
export interface SnapshotPersister {
  persist(snapshot: FullSnapshot): Promise<void>;
  load(): Promise<FullSnapshot | null>;
}

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
}

export interface AuthorizationContext {
  actorId: string;
  actorType: 'human' | 'artificial' | 'system';
  roles: string[];
  decisionRef?: string;
  authenticatedAt?: string;
}

export type AkorisEvent =
  | { type: 'log:entry'; payload: LogEntry }
  | { type: 'state:transition'; payload: TransitionHistoryItem };