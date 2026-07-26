import { describe, it, expect } from 'vitest';
import { QualityGateEngine } from '../src/quality-gate-engine.js';
import type { GateContext } from '../src/quality-gate-engine.js';

const defaultContext: GateContext = {
  logs: [],
  history: [],
  currentState: 'ideation',
};

describe('QualityGateEngine', () => {
  it('should evaluate empty gate list', () => {
    const engine = new QualityGateEngine();
    const result = engine.evaluate([], defaultContext);
    expect(result).toEqual([]);
  });

  it('should return PENDING for gate-plan-approved in ideation', () => {
    const engine = new QualityGateEngine();
    const result = engine.evaluate(['gate-plan-approved'], defaultContext);
    expect(result[0].status).toBe('PENDING');
  });

  it('should return PASS for gate-plan-approved after leaving ideation', () => {
    const engine = new QualityGateEngine();
    const ctx = { ...defaultContext, currentState: 'development' };
    const result = engine.evaluate(['gate-plan-approved'], ctx);
    expect(result[0].status).toBe('PASS');
  });

  it('should return SKIPPED for unknown gate', () => {
    const engine = new QualityGateEngine();
    const result = engine.evaluate(['unknown-gate'], defaultContext);
    expect(result[0].status).toBe('SKIPPED');
  });

  it('should return FAIL for gate-quality-passed with many errors', () => {
    const engine = new QualityGateEngine();
    const ctx: GateContext = {
      ...defaultContext,
      logs: Array.from({ length: 5 }, (_, i) => ({
        id: `e${i}`, timestamp: new Date().toISOString(), level: 'error' as const, agent: 'test', message: 'test error',
      })),
    };
    const result = engine.evaluate(['gate-quality-passed'], ctx);
    expect(result[0].status).toBe('FAIL');
  });

  it('allPassed returns true when all gates pass', () => {
    const engine = new QualityGateEngine();
    const ctx = { ...defaultContext, currentState: 'review' };
    expect(engine.allPassed([], ctx)).toBe(true);
  });

  it('allPassed returns false when any gate is not PASS', () => {
    const engine = new QualityGateEngine();
    expect(engine.allPassed(['gate-plan-approved'], defaultContext)).toBe(false);
  });

  it('should support custom evaluators', () => {
    const engine = new QualityGateEngine([
      { id: 'custom-gate', description: 'Custom', evaluate: () => 'PASS' },
    ]);
    const result = engine.evaluate(['custom-gate'], defaultContext);
    expect(result[0].status).toBe('PASS');
  });
});
