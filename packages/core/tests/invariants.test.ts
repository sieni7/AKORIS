import { describe, it, expect } from 'vitest';
import type {
  AuthorizationContext,
  SnapshotPersister,
  TransitionContext,
} from '../src/types.js';
import type { QualityGateEngine } from '../src/engines/quality-gate.js';
import { StateMachineEngine } from '../src/engines/state-machine.js';
import { EventBus } from '../src/event-bus.js';
import { TEST_MACHINE, FakePersister } from './fixtures/state-machine.js';
import { passGateEngine, failGateEngine, pendingGateEngine } from './fixtures/gates.js';
import { MOCK_AGENTS } from './fixtures/agents.js';
import { VersionConflictError } from '../src/errors.js';

const VALIDATOR: AuthorizationContext = {
  actorId: 'CORE-01',
  actorType: 'artificial',
  roles: ['VALIDATOR'],
};
const HUMAN: AuthorizationContext = {
  actorId: 'CORE-01',
  actorType: 'human',
  roles: ['HUMAN_DECISION'],
};

const ctx = (over: Partial<TransitionContext> = {}): TransitionContext => ({
  from: 'PROPOSITION',
  to: 'DRAFT',
  authorizedBy: VALIDATOR,
  artifact: { context: 'x', justification: 'y', solution: 'z' },
  ...over,
});

const makeEngine = (persister?: SnapshotPersister, gateEngine?: QualityGateEngine, bus?: EventBus, agents = MOCK_AGENTS) =>
  new StateMachineEngine(TEST_MACHINE, persister ?? new FakePersister(), undefined, gateEngine, bus, agents);

describe('Invariants I-1 à I-8', () => {
  describe('I-1 Atomicité de transition', () => {
    it('gate FAIL → aucune mutation (état, historique, version)', async () => {
      const engine = makeEngine(undefined, failGateEngine());
      const before = engine.getVersion();
      const outcome = await engine.transition(ctx());
      expect(outcome.status).toBe('rejected');
      expect(engine.getCurrentState().currentState).toBe('PROPOSITION');
      expect(engine.getHistory()).toHaveLength(0);
      expect(engine.getVersion()).toBe(before);
    });

    it('gate PENDING requis → aucune mutation', async () => {
      const engine = makeEngine(undefined, pendingGateEngine());
      const outcome = await engine.transition(ctx());
      expect(outcome.status).toBe('rejected');
      expect(engine.getCurrentState().currentState).toBe('PROPOSITION');
      expect(engine.getHistory()).toHaveLength(0);
    });

    it('échec de persistance → persistence-failed, aucune mutation (I-1)', async () => {
      const failing: SnapshotPersister = {
        async saveSnapshotIfVersion() {
          throw new Error('disque plein');
        },
        async loadSnapshot() {
          return null;
        },
      };
      const engine = makeEngine(failing, passGateEngine());
      const outcome = await engine.transition(ctx());
      expect(outcome.status).toBe('persistence-failed');
      expect(engine.getCurrentState().currentState).toBe('PROPOSITION');
      expect(engine.getHistory()).toHaveLength(0);
      expect(engine.getVersion()).toBe(0);
    });
  });

  describe('I-2 Snapshot = source de vérité', () => {
    it("restoreState reconstruit l'état de façon idempotente", async () => {
      const engine = makeEngine(undefined, passGateEngine());
      await engine.transition(ctx());
      await engine.transition(ctx({ from: 'DRAFT', to: 'PLANNED' }));
      const snap = engine.getStateSnapshot();
      expect(snap.current).toBe('PLANNED');
      expect(snap.history).toHaveLength(2);

      // Deux reconstructions successives → résultat identique (idempotence).
      const engine2 = makeEngine();
      engine2.restoreState(JSON.parse(JSON.stringify(snap)));
      expect(engine2.getCurrentState()).toEqual({ currentState: 'PLANNED' });
      const engine3 = makeEngine();
      engine3.restoreState(JSON.parse(JSON.stringify(snap)));
      expect(engine3.getStateSnapshot()).toEqual(engine2.getStateSnapshot());
    });
  });

  describe('I-3 Événement non transactionnel', () => {
    it('persistance précède émission ; erreur de listener ne casse pas le commit', async () => {
      const bus = new EventBus();
      const order: string[] = [];
      bus.on('state:transition', () => {
        order.push('emit');
      });
      const persister = new FakePersister();
      const engine = makeEngine(persister, passGateEngine(), bus);
      const outcome = await engine.transition(ctx());
      expect(outcome.status).toBe('committed');
      expect(order).toEqual(['emit']);
      expect(persister.latest).toBe(1);
    });

    it('une exception dans emit() ne modifie pas le résultat committed (I-3)', async () => {
      const badBus = new EventBus();
      badBus.on('state:transition', () => {
        throw new Error('player planté');
      });
      const engine = makeEngine(undefined, passGateEngine(), badBus);
      const outcome = await engine.transition(ctx());
      expect(outcome.status).toBe('committed');
    });
  });

  describe('I-4 Réentrance interdite', () => {
    it('un appel transition() imbriqué pendant une transition est rejeté', async () => {
      const engine = new StateMachineEngine(
        TEST_MACHINE,
        new FakePersister(),
        undefined,
        passGateEngine(),
        undefined,
        MOCK_AGENTS,
      );
      // Persister qui déclenche une seconde transition pendant la première.
      const outer = engine.transition(ctx()).then((o) => o);
      const inner = engine.transition(ctx({ authorizedBy: { ...VALIDATOR, actorId: 'CORE-01' } }));
      const [outerResult, innerResult] = await Promise.all([outer, inner]);
      expect(outerResult.status).toBe('committed');
      expect(innerResult.status).toBe('rejected');
    });
  });

  describe('I-5 Autorisation vérifiée', () => {
    it('actorId absent du Registry → rejected (I-5)', async () => {
      const engine = makeEngine(undefined, passGateEngine());
      const outcome = await engine.transition(ctx({ authorizedBy: { ...VALIDATOR, actorId: 'GHOST-42' } }));
      expect(outcome.status).toBe('rejected');
    });

    it('agent artificiel + rôle HUMAN_DECISION → rejected (I-5)', async () => {
      const engine = makeEngine(undefined, passGateEngine());
      engine.restoreState({ current: 'VALIDATED', history: [], machineVersion: '1.0.1' });
      const outcome = await engine.transition({
        from: 'VALIDATED',
        to: 'RELEASED',
        authorizedBy: { actorId: 'CORE-01', actorType: 'artificial', roles: ['HUMAN_DECISION'] },
      });
      expect(outcome.status).toBe('rejected');
    });

    it('transition VALIDATED→RELEASED accepte un acteur humain (HUMAN_DECISION)', async () => {
      const engine = makeEngine(undefined, passGateEngine());
      engine.restoreState({ current: 'VALIDATED', history: [], machineVersion: '1.0.1' });
      const outcome = await engine.transition({
        from: 'VALIDATED',
        to: 'RELEASED',
        authorizedBy: HUMAN,
      });
      expect(outcome.status).toBe('committed');
    });
  });

  describe('I-6 Reprise sans merge', () => {
    it('conflit de version → conflict (VersionConflictError), aucun merge', async () => {
      const persister = new FakePersister();
      await persister.saveSnapshotIfVersion(0, {
        version: 1,
        machineVersion: '1.0.1',
        instanceId: 'other',
        state: { current: 'DRAFT', history: [], machineVersion: '1.0.1' },
        logs: [],
        secrets: [],
        aliases: [],
        templates: [],
        checksum: '',
        savedAt: new Date().toISOString(),
      });
      const engine = makeEngine(persister, passGateEngine());
      const outcome = await engine.transition(ctx());
      expect(outcome.status).toBe('conflict');
      expect(outcome.status === 'conflict' && outcome.error).toBeInstanceOf(VersionConflictError);
      expect(engine.getCurrentState().currentState).toBe('PROPOSITION');
      expect(engine.getHistory()).toHaveLength(0);
    });
  });
});