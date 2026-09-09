import { describe, it, expect } from 'vitest';
import type { GateContext, GateDefinition, GateEvaluator } from '../src/types.js';
import { QualityGateEngine } from '../src/engines/quality-gate.js';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const baseCtx = (over: Partial<GateContext> = {}): GateContext => ({
  currentState: 'PROPOSITION',
  history: [],
  logs: [],
  ...over,
});

const gate = (over: Partial<GateDefinition> = {}): GateDefinition => ({
  id: 'QG-TEST',
  version: '1.0.0',
  criteria: [
    { id: 'CRIT-1', name: 'one', evaluator: 'field_exists', params: { field: 'context' }, weight: 0.5 },
    { id: 'CRIT-2', name: 'two', evaluator: 'field_exists', params: { field: 'justification' }, weight: 0.5 },
  ],
  evaluatorIds: ['field_exists'],
  requiredEvidenceLevels: ['E1'],
  blocking: true,
  threshold: 0.7,
  ...over,
});

const alwaysHalf: GateEvaluator = {
  id: 'always_half',
  evaluate: () => ({ status: 'PASS', score: 0.5, details: 'half' }),
};
const alwaysFull: GateEvaluator = {
  id: 'always_full',
  evaluate: () => ({ status: 'PASS', score: 1, details: 'full' }),
};

describe('QualityGateEngine', () => {
  it('registerGate + listGates expose les définitions sérialisables', () => {
    const engine = new QualityGateEngine();
    engine.registerGate(gate({ id: 'QG-A' }));
    const gates = engine.listGates();
    expect(gates).toHaveLength(1);
    expect(gates[0].id).toBe('QG-A');
  });

  it('evaluate: PASS si tous les critères existent et seuil atteint', () => {
    const engine = new QualityGateEngine();
    engine.registerGate(gate());
    const results = engine.evaluate(['QG-TEST'], baseCtx({ artifact: { context: 'x', justification: 'y' } }));
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('PASS');
    expect(results[0].criterionResults.every((c) => c.status === 'PASS')).toBe(true);
  });

  it('evaluate: FAIL si un champ requis est absent (score pondéré < seuil)', () => {
    const engine = new QualityGateEngine();
    engine.registerGate(gate());
    const results = engine.evaluate(['QG-TEST'], baseCtx({ artifact: { context: 'x' } }));
    expect(results[0].status).toBe('FAIL');
    const failed = results[0].criterionResults.find((c) => c.criterionId === 'CRIT-2')!;
    expect(failed.status).toBe('FAIL');
    expect(failed.details).toContain('justification');
  });

  it('evaluate: FAIL si un critère échoue même si le seuil est atteint (bloquant)', () => {
    const engine = new QualityGateEngine();
    engine.registerGate(gate({ blocking: true, threshold: 0 }));
    const results = engine.evaluate(['QG-TEST'], baseCtx({ artifact: { context: 'x' } }));
    expect(results[0].status).toBe('FAIL');
  });

  it('evaluate: PENDING pour un gate non enregistré', () => {
    const engine = new QualityGateEngine();
    const results = engine.evaluate(['QG-INCONNU'], baseCtx());
    expect(results[0].status).toBe('PENDING');
  });

  it('evaluateAll évalue les gates enregistrés', () => {
    const engine = new QualityGateEngine();
    engine.registerGate(gate({ id: 'QG-A' }));
    engine.registerGate(gate({ id: 'QG-B' }));
    const results = engine.evaluateAll(baseCtx({ artifact: { context: 'x', justification: 'y' } }));
    expect(results.map((r) => r.gateId).sort()).toEqual(['QG-A', 'QG-B']);
  });

  it('règle v1 : threshold appliqué sur moyenne pondérée', () => {
    const engine = new QualityGateEngine([alwaysHalf, alwaysFull]);
    engine.registerGate(
      gate({
        criteria: [
          { id: 'C-A', name: 'a', evaluator: 'always_half', params: {}, weight: 0.5 },
          { id: 'C-B', name: 'b', evaluator: 'always_full', params: {}, weight: 0.5 },
        ],
        threshold: 0.9,
        blocking: false,
        evaluatorIds: ['always_half', 'always_full'],
      }),
    );
    const results = engine.evaluate(['QG-TEST'], baseCtx());
    expect(results[0].status).toBe('FAIL'); // (0.5+1.0)/2 = 0.75 < 0.9
  });

  it('registerGatesFromRegistry charge le registry de qualité réel (6 gates, QG-RELEASED absent)', () => {
    const here = resolve(fileURLToPath(new URL('.', import.meta.url)));
    const registryDir = resolve(here, '../../../registry', 'quality-gates');
    const engine = new QualityGateEngine();
    const count = engine.registerGatesFromRegistry(registryDir);
    expect(count).toBe(6);
    expect(engine.hasGate('QG-PROPOSITION')).toBe(true);
    expect(engine.hasGate('QG-RELEASED')).toBe(false);
  });
});