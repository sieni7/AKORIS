export interface Manifest {
  'akoris': string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  registry: {
    version: string;
    url?: string;
  };
  playbook?: string;
  projectType?: string;
  components?: {
    cli?: boolean;
    sdk?: boolean;
    adapters?: boolean;
    connectors?: boolean;
  };
  tools?: {
    packageManager?: string;
    language?: string;
  };
}

export interface Policy {
  id: string;
  name: string;
  version: string;
  category: string;
  severity: 'blocker' | 'critical' | 'major' | 'minor';
  description: string;
  rules: PolicyRule[];
}

export interface PolicyRule {
  id: string;
  description: string;
  check: string;
}

export interface Contract {
  id: string;
  name: string;
  version: string;
  role: string;
  description: string;
  inputs: ContractIO[];
  outputs: ContractIO[];
  constraints: string[];
  qualityGates: string[];
}

export interface ContractIO {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  validationCriteria?: string[];
}

export interface QualityGate {
  id: string;
  name: string;
  description: string;
  type: 'automated' | 'manual';
  critical: boolean;
  check?: string;
  threshold?: number;
}

export interface Workflow {
  id: string;
  name: string;
  version: string;
  description: string;
  phases: WorkflowPhase[];
  policies: string[];
}

export interface WorkflowPhase {
  name: string;
  tasks: string[];
  qualityGate: string;
}

export interface Agent {
  id: string;
  name: string;
  version: string;
  domain: string;
  capabilities: string[];
  contracts: string[];
  policies: string[];
  prompts: Record<string, string>;
}

export interface CheckResult {
  gate: string;
  name: string;
  passed: boolean;
  details?: string;
}

// === Registry v2 types ===

export interface RegistryIndex {
  version: string;
  components: Record<string, { count: number; path: string }>;
  domains: Array<{ id: string; name: string; agentCount: number; color: string }>;
}

export interface DependencyGraph {
  version: string;
  agents: Record<string, {
    dependsOn: string[];
    dependedBy: string[];
  }>;
}

export interface ActivationMatrix {
  version: string;
  events: Record<string, {
    description: string;
    agents: string[];
    frequency: string;
    phase: string;
  }>;
}

export interface CapabilityRegistry {
  version: string;
  capabilities: Record<string, string[]>;
}

export interface StateMachine {
  version: string;
  name: string;
  initialState: string;
  states: Array<{ id: string; description: string }>;
  transitions: Array<{
    from: string;
    to: string;
    gates: string[];
    authorizedBy: string;
    agents: string[];
    description?: string;
  }>;
}

export interface Rule {
  id: string;
  name: string;
  severity: 'blocker' | 'critical' | 'major' | 'minor' | 'info';
  if: string;
  then: string;
  otherwise?: string;
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'document' | 'code' | 'report' | 'config' | 'diagram';
  producedBy: string[];
  consumedBy: string[];
  mandatory: boolean;
}

export interface Event {
  id: string;
  name: string;
  phase: string;
  description: string;
  triggers: string[];
  producedBy: string[];
  consumedBy: string[];
}
