export interface Agent {
  id: string; // "CORE-01-Orchestrator"
  name: string;
  domain: 'CORE' | 'DEV' | 'QA' | 'EXP' | 'GOV' | string;
  criticity: 'critique' | 'haute' | 'moyenne' | 'basse';
  status: 'active' | 'inactive' | 'deprecated' | 'draft';
  version: string; // SemVer
  description: string;
  tags: string[];
  dependencies: AgentDependency[];
  tokenEstimate?: number;
  activatedBy?: string[]; // Event IDs
  produces?: string[]; // Deliverable IDs
  validates?: string[]; // QualityGate IDs
  capabilities: Capability[];
}

export interface AgentDependency {
  agentId: string;
  type: 'mandatory' | 'optional';
  description?: string;
}

export interface Capability {
  id: string; // "design_architecture"
  name: string;
  description: string;
  agentId: string;
  type: 'can' | 'cannot';
}

export interface Contract {
  agentId: string;
  version: string;
  mission: string;
  responsibilities: string[];
  limits: string[];
  inputs: ContractIO[];
  outputs: ContractIO[];
  qualityGates: string[]; // QG IDs
  promptTemplate: string;
  raci: RACI;
}

export interface ContractIO {
  id: string;
  name: string;
  description: string;
  type: 'documentation' | 'code' | 'configuration' | 'rapport' | 'plan' | 'specification' | 'audit';
  mandatory: boolean;
}

export interface RACI {
  responsible: string[]; // Agent IDs
  accountable: string; // Agent ID
  consulted: string[]; // Agent IDs
  informed: string[]; // Agent IDs
}
