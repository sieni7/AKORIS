export interface AgentDependency {
  agentId: string;
  type: 'mandatory' | 'optional';
  description?: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  agentId: string;
  type: 'can' | 'cannot';
}

export interface Agent {
  id: string;
  name: string;
  domain: string;
  criticity: 'critique' | 'haute' | 'moyenne' | 'basse';
  status: 'active' | 'inactive' | 'deprecated' | 'draft';
  version: string;
  description: string;
  tags: string[];
  dependencies: AgentDependency[];
  capabilities: Capability[];
}

export interface State {
  id: string;
  name: string;
  phase: string;
  description: string;
}

export interface TransitionDef {
  from: string;
  to: string;
  requiredGates: string[];
  authorizedBy: string[];
  description: string;
}

export interface StateMachine {
  version: string;
  states: State[];
  transitions: TransitionDef[];
}

export interface TransitionHistoryItem {
  id: string;
  from: string;
  to: string;
  at: string;
  authorizedBy: string;
  comment?: string;
}

export interface GateStatus {
  gateId: string;
  status: 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';
  details?: string;
}

export interface TransitionResult {
  success: boolean;
  newState: string;
  history: TransitionHistoryItem;
  gatesStatus: GateStatus[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  agent: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface DoctorIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
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
