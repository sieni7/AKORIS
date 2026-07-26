export interface QualityGate {
  id: string; // "QG-018"
  name: string;
  description: string;
  severity: 'bloquante' | 'critique' | 'majeure' | 'mineure';
  owner: string; // Agent ID
  criteria: GateCriteria[];
  threshold: number; // score minimum (0-1)
  controls: string[]; // Transition IDs
}

export interface GateCriteria {
  id: string;
  name: string;
  description: string;
  evaluator: string;
  weight: number;
  params?: Record<string, unknown>;
}

export interface GateResult {
  gateId: string;
  status: 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';
  score: number;
  details: string;
  evaluatedAt: string;
}
