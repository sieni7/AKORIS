export type Domain = 'CORE' | 'DEV' | 'QA' | 'EXP' | 'GOV';
export type Criticity = 'critique' | 'haute' | 'moyenne' | 'basse';
export type AgentStatus = 'active' | 'inactive' | 'deprecated' | 'draft';

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
