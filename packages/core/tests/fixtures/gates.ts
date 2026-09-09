import { QualityGateEngine } from '../../src/engines/quality-gate.js';
import type { GateEvaluator } from '../../src/types.js';

const alwaysPass: GateEvaluator = {
  id: 'always_pass',
  evaluate: () => ({ status: 'PASS', score: 1, details: 'pass' }),
};

const GATE_IDS = [
  'QG-PROPOSITION',
  'QG-DRAFT',
  'QG-PLANNED',
  'QG-ACTIVE',
  'QG-AUDIT',
  'QG-VALIDATED',
] as const;

/**
 * QualityGateEngine de test : inscrit les 6 gates obligatoires de la machine de
 * test (tous PASS) afin de tester les transitions heureuses et les invariants.
 */
export function passGateEngine(): QualityGateEngine {
  const engine = new QualityGateEngine([alwaysPass]);
  for (const id of GATE_IDS) {
    engine.registerGate({
      id,
      version: '1.0.0',
      criteria: [{ id: 'C', name: 'c', evaluator: 'always_pass', params: {}, weight: 1 }],
      evaluatorIds: ['always_pass'],
      requiredEvidenceLevels: ['E1'],
      blocking: true,
      threshold: 1,
    });
  }
  return engine;
}

/**
 * GateEngine dont les gates sont absents → toute évaluation retourne PENDING
 * (aucun gate requis ne peut passer).
 */
export function pendingGateEngine(): QualityGateEngine {
  return new QualityGateEngine();
}

export function failGateEngine(): QualityGateEngine {
  const engine = new QualityGateEngine([
    {
      id: 'always_fail',
      evaluate: () => ({ status: 'FAIL', score: 0, details: 'fail' }),
    },
  ]);
  engine.registerGate({
    id: 'QG-PROPOSITION',
    version: '1.0.0',
    criteria: [{ id: 'C', name: 'c', evaluator: 'always_fail', params: {}, weight: 1 }],
    evaluatorIds: ['always_fail'],
    requiredEvidenceLevels: ['E1'],
    blocking: true,
    threshold: 1,
  });
  return engine;
}