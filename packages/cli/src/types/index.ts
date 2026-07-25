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
