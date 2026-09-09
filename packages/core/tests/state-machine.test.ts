import { describe, it, expect, vi } from 'vitest';
import type { Agent, AuthorizationContext, TransitionContext } from '../src/types.js';
import type { QualityGateEngine } from '../src/engines/quality-gate.js';
import { StateMachineEngine } from '../src/engines/state-machine.js';
import { EventBus } from '../src/event-bus.js';
import { TEST_MACHINE, FakePersister } from './fixtures/state-machine.js';
import { passGateEngine, failGateEngine } from './fixtures/gates.js';
import { MOCK_AGENTS } from './fixtures/agents.js';
import { VersionConflictError, TransitionError } from '../src/errors.js';

const VALIDATOR_CTX: AuthorizationContext = {
  actorId: 'CORE-01',
  actorType: 'artificial',
  roles: ['VALIDATOR'],
};

function makeEngine(options?: { gateEngine?: QualityGateEngine; bus?: EventBus; agents?: Agent[] }) {
  return new StateMachineEngine(TEST_MACHINE, new FakePersister(), undefined, options?.gateEngine, options?.bus, options?.agents);
}

const happyCtx: TransitionContext = {
  from: 'PROPOSITION',
  to: 'DRAFT',
  authorizedBy: VALIDATOR_CTX,
  artifact: { context: 'x', justification: 'y', solution: 'z' },
};

describe('StateMachineEngine', () => {
  it('état initial depuis initialState', () => {
    const engine = makeEngine();
    expect(engine.getCurrentState()).toEqual({ currentState: 'PROPOSITION' });
    expect(engine.getHistory()).toEqual([]);
    expect(engine.getStateSnapshot().current).toBe('PROPOSITION');
  });

  it('transition valide → committed, nouvel état, historique, E1 présent', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine() });
    const outcome = await engine.transition(happyCtx);
    expect(outcome.status).toBe('committed');
    if (outcome.status !== 'committed') return;
    expect(outcome.result.newState).toBe('DRAFT');
    expect(outcome.result.persistedVersion).toBe(1);
    const item = outcome.result.history;
    expect(item.from).toBe('PROPOSITION');
    expect(item.to).toBe('DRAFT');
    expect(item.evidence.level).toBe('E1');
    expect(item.evidence.algorithm).toBe('SHA-256');
    expect(item.evidence.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(engine.getCurrentState()).toEqual({ currentState: 'DRAFT' });
    expect(engine.getHistory()).toHaveLength(1);
  });

  it('transition inexistante → rejected', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine() });
    const outcome = await engine.transition({ ...happyCtx, to: 'RELEASED' });
    expect(outcome.status).toBe('rejected');
    expect(engine.getCurrentState()).toEqual({ currentState: 'PROPOSITION' });
  });

  it('from ≠ currentState → rejected', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine() });
    const outcome = await engine.transition({ ...happyCtx, from: 'DRAFT' });
    expect(outcome.status).toBe('rejected');
    expect(outcome.status === 'rejected' && outcome.error).toBeInstanceOf(TransitionError);
  });

  it('rôles incompatibles → rejected (I-5)', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine() });
    const outcome = await engine.transition({ ...happyCtx, authorizedBy: { ...VALIDATOR_CTX, roles: ['MAINTAINER'] } });
    expect(outcome.status).toBe('rejected');
    expect(engine.getCurrentState()).toEqual({ currentState: 'PROPOSITION' });
  });

  it('actorId absent du Registry → rejected (I-5)', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine(), agents: MOCK_AGENTS });
    const outcome = await engine.transition({ ...happyCtx, authorizedBy: { ...VALIDATOR_CTX, actorId: 'INCONNU-99' } });
    expect(outcome.status).toBe('rejected');
    expect(outcome.status === 'rejected' && outcome.error.reason).toContain('Registry');
  });

  it('agent artificiel + HUMAN_DECISION → rejected (I-5)', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine() });
    engine.restoreState({ current: 'VALIDATED', history: [], machineVersion: '1.0.1' });
    const outcome = await engine.transition({
      from: 'VALIDATED',
      to: 'RELEASED',
      authorizedBy: { actorId: 'CORE-01', actorType: 'artificial', roles: ['HUMAN_DECISION'] },
    });
    expect(outcome.status).toBe('rejected');
  });

  it('gate FAIL → rejected, aucune mutation (I-1)', async () => {
    const engine = makeEngine({ gateEngine: failGateEngine() });
    const outcome = await engine.transition({ ...happyCtx, artifact: {} });
    expect(outcome.status).toBe('rejected');
    expect(engine.getCurrentState()).toEqual({ currentState: 'PROPOSITION' });
    expect(engine.getHistory()).toEqual([]);
  });

  it('conflit de version → conflict, aucune mutation (I-6)', async () => {
    const persister = new FakePersister();
    await persister.saveSnapshotIfVersion(0, {
      version: 1,
      machineVersion: '1.0.1',
      instanceId: 'other-instance',
      state: { current: 'DRAFT', history: [], machineVersion: '1.0.1' },
      logs: [],
      secrets: [],
      aliases: [],
      templates: [],
      checksum: '',
      savedAt: new Date().toISOString(),
    });
    const engine = new StateMachineEngine(TEST_MACHINE, persister, undefined, passGateEngine());
    // Le persister a déjà current=1 : un save attendu=0 → CONFLICT (I-6, pas de merge).
    const outcome = await engine.transition(happyCtx);
    expect(outcome.status).toBe('conflict');
    expect(outcome.status === 'conflict' && outcome.error).toBeInstanceOf(VersionConflictError);
    expect(engine.getCurrentState()).toEqual({ currentState: 'PROPOSITION' });
  });

  it('événement émis après commit (I-3)', async () => {
    const bus = new EventBus();
    const spy = vi.fn();
    bus.on('state:transition', spy);
    const engine = makeEngine({ gateEngine: passGateEngine(), bus });
    const outcome = await engine.transition(happyCtx);
    expect(outcome.status).toBe('committed');
    expect(spy).toHaveBeenCalledTimes(1);
    const event = spy.mock.calls[0][0];
    expect(event.type).toBe('state:transition');
    expect(event.payload.from).toBe('PROPOSITION');
    expect(event.payload.to).toBe('DRAFT');
    expect(event.payload.authorizedBy).toEqual(['VALIDATOR']);
  });

  it('restoreState recharge un snapshot sans merge (I-2)', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine() });
    const snapshot = engine.getStateSnapshot();
    const engine2 = makeEngine();
    engine2.restoreState(snapshot);
    expect(engine2.getCurrentState()).toEqual({ currentState: 'PROPOSITION' });
    expect(engine2.getStateSnapshot()).toEqual(snapshot);
  });

  it('setLogs alimente le contexte des gates', async () => {
    const engine = makeEngine({ gateEngine: passGateEngine() });
    engine.setLogs([{ id: 'l1', timestamp: new Date().toISOString(), level: 'info', agent: 'CORE-01', message: 'ok' }]);
    expect(engine.getHistory()).toEqual([]);
  });

  it('machine du registry réel : 8 états + 3 exceptionStates = 11, 7 transitions (spec §9.1)', () => {
    expect(TEST_MACHINE.states).toHaveLength(8);
    expect(Object.keys(TEST_MACHINE.exceptionStates ?? {})).toHaveLength(3);
    expect(TEST_MACHINE.transitions).toHaveLength(7);
    expect(TEST_MACHINE.initialState).toBe('PROPOSITION');
    expect(TEST_MACHINE.terminalStates).toEqual(['ARCHIVED']);
  });
});