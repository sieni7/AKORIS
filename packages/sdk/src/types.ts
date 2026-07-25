export interface RegistrySummary {
  policies: number;
  agents: number;
  contracts: number;
  workflows: number;
  checklists: number;
  templates: number;
  qualityGates: number;
  metrics: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface AuditReport {
  date: string;
  status: 'passed' | 'failed';
  checks: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
  summary: {
    passed: number;
    failed: number;
    total: number;
  };
}

export interface QualityCheckResult {
  overall: 'passed' | 'failed';
  gates: Array<{
    gate: string;
    name: string;
    passed: boolean;
    details?: string;
  }>;
  summary: {
    passed: number;
    failed: number;
    total: number;
  };
}
