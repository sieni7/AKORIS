import { randomUUID } from 'node:crypto';
import type {
  Agent,
  AuthorizationContext,
  FullSnapshot,
  LogEntry,
  SnapshotPersister,
  StateMachine,
  StatePersistence,
  TransitionContext,
  TransitionDef,
  TransitionHistoryItem,
  TransitionOutcome,
  TransitionResult,
} from '../types.js';
import { PersistenceError, TransitionError, VersionConflictError } from '../errors.js';
import { newE1, sha256 } from '../utils/crypto.js';
import type { QualityGateEngine } from './quality-gate.js';
import { EventBus } from '../event-bus.js';

/**
 * StateMachineEngine — transitions atomiques (§5.2 spec).
 *
 * Séquence (§5.2) : réentrance → from === current → TransitionDef → autorisation
 * (roles ⊆ authorizedBy) → actor existe (I-5) → gates → copy-on-write + E1 →
 * PERSISTER (version optimiste) → commit mémoire → événement (non transactionnel).
 *
 * Aucune mutation en mémoire en cas d'échec, de conflit ou de gate FAIL (I-1, I-6).
 */
export class StateMachineEngine {
  private readonly machine: StateMachine;
  private readonly persister: SnapshotPersister;
  private readonly gateEngine?: QualityGateEngine;
  private readonly bus?: EventBus;
  private readonly agents: Map<string, Agent> | null;

  private currentState: string;
  private history: TransitionHistoryItem[] = [];
  private version = 0;
  private transitioning = false;
  private logs: LogEntry[] = [];
  private readonly instanceId = randomUUID();
  private initialStateId: string;

  constructor(
    machine: StateMachine,
    persister: SnapshotPersister,
    initialStateId?: string,
    gateEngine?: QualityGateEngine,
    bus?: EventBus,
    agents?: Agent[],
  ) {
    this.machine = machine;
    this.persister = persister;
    this.gateEngine = gateEngine;
    this.bus = bus;
    this.agents = agents ? new Map(agents.map((a) => [a.id, a])) : null;
    this.initialStateId = initialStateId ?? machine.initialState;
    this.currentState = this.initialStateId;
  }

  loadMachine(): StateMachine {
    return this.machine;
  }

  getCurrentState(): { currentState: string } {
    return { currentState: this.currentState };
  }

  getHistory(): TransitionHistoryItem[] {
    return this.history;
  }

  getStateSnapshot(): StatePersistence {
    return {
      current: this.currentState,
      history: this.history,
      machineVersion: this.machine.version,
    };
  }

  getVersion(): number {
    return this.version;
  }

  restoreState(snapshot: StatePersistence): void {
    this.currentState = snapshot.current;
    this.history = snapshot.history.slice();
    this.version = 0;
  }

  setLogs(logs: LogEntry[]): void {
    this.logs = logs.slice();
  }

  async transition(context: TransitionContext): Promise<TransitionOutcome> {
    // 1. Guard de réentrance (I-4)
    if (this.transitioning) {
      return {
        status: 'rejected',
        error: new TransitionError(context.from, context.to, 'transition déjà en cours (I-4)'),
      };
    }
    this.transitioning = true;

    try {
      // 2. from === current
      if (context.from !== this.currentState) {
        return {
          status: 'rejected',
          error: new TransitionError(
            context.from,
            context.to,
            `état courant '${this.currentState}' ≠ from`,
          ),
        };
      }

      // 3. Trouver TransitionDef
      const transitionDef = this.findTransition(context.from, context.to);
      if (!transitionDef) {
        return {
          status: 'rejected',
          error: new TransitionError(context.from, context.to, 'transition inexistante'),
        };
      }

      // 4. Autorisation (I-5) : roles ⊆ authorizedBy
      if (!this.isAuthorized(context.authorizedBy, transitionDef)) {
        return {
          status: 'rejected',
          error: new TransitionError(
            context.from,
            context.to,
            `rôles ${JSON.stringify(context.authorizedBy.roles)} incompatibles avec ${JSON.stringify(transitionDef.authorizedBy)}`,
          ),
        };
      }

      // 5. actorId existe (I-5) + agent artificiel jamais HUMAN_DECISION
      if (context.authorizedBy.actorType === 'artificial' && context.authorizedBy.roles.includes('HUMAN_DECISION')) {
        return {
          status: 'rejected',
          error: new TransitionError(
            context.from,
            context.to,
            "agent artificiel ne peut pas porter HUMAN_DECISION (I-5)",
          ),
        };
      }
      if (this.agents && !this.agents.has(context.authorizedBy.actorId)) {
        return {
          status: 'rejected',
          error: new TransitionError(
            context.from,
            context.to,
            `actorId '${context.authorizedBy.actorId}' absent du Registry (I-5)`,
          ),
        };
      }

      // 6. Gates (requis de la transition)
      const gateEvaluations = await this.evaluateRequiredGates(transitionDef, context, this.currentState);
      if (!gateEvaluations.evaluated) {
        return {
          status: 'rejected',
          error: new TransitionError(
            context.from,
            context.to,
            `gates requis non évaluables : ${gateEvaluations.reason}`,
          ),
        };
      }
      const failing = gateEvaluations.results.filter((g) => g.status !== 'PASS');
      if (failing.length > 0) {
        return {
          status: 'rejected',
          error: new TransitionError(
            context.from,
            context.to,
            `gates FAIL/PENDING : ${failing.map((g) => `${g.gateId}=${g.status}`).join(', ')}`,
          ),
        };
      }

      // 8. copy-on-write + E1
      const item = this.buildHistoryItem(context);
      const copyHistory = [...this.history, item];
      const copyState: StatePersistence = {
        current: context.to,
        history: copyHistory,
        machineVersion: this.machine.version,
      };

      // 9. Persister (version optimiste) — snapshot construit sur l'état COPIÉ
      const newVersion = this.version + 1;
      const snapshot = this.buildSnapshot(copyState, newVersion);
      let saveResult: { success: true } | { success: false; currentVersion: number; error: 'CONFLICT' };
      try {
        saveResult = await this.persister.saveSnapshotIfVersion(this.version, snapshot);
      } catch (err) {
        return {
          status: 'persistence-failed',
          error: new PersistenceError(`sauvegarde impossible : ${(err as Error)?.message ?? String(err)}`),
        };
      }

      // 10. Échec → aucune mutation (I-1, I-6)
      if (!saveResult.success) {
        return {
          status: 'conflict',
          error: new VersionConflictError(this.version, saveResult.currentVersion),
        };
      }

      // 11. COMMIT mémoire
      this.currentState = copyState.current;
      this.history = copyHistory;
      this.version = newVersion;

      const result: TransitionResult = {
        transitionId: item.id,
        newState: context.to,
        history: item,
        gateEvaluations: gateEvaluations.results,
        persistedVersion: newVersion,
      };

      // 12. Événement non transactionnel (I-3) — copie, une erreur n'affecte pas le commit
      this.emitTransitionEvent(item);

      return { status: 'committed', result };
    } finally {
      this.transitioning = false;
    }
  }

  private findTransition(from: string, to: string): TransitionDef | undefined {
    return this.machine.transitions.find((t) => t.from === from && t.to === to);
  }

  private isAuthorized(auth: AuthorizationContext, def: TransitionDef): boolean {
    return auth.roles.length > 0 && auth.roles.every((role) => def.authorizedBy.includes(role));
  }

  private async evaluateRequiredGates(
    def: TransitionDef,
    context: TransitionContext,
    current: string,
  ): Promise<{ evaluated: true; results: TransitionResult['gateEvaluations'] } | { evaluated: false; reason: string }> {
    if (def.requires.length === 0) {
      return { evaluated: true, results: [] };
    }
    if (!this.gateEngine) {
      return { evaluated: false, reason: 'aucun QualityGateEngine injecté' };
    }
    const ctx = {
      currentState: current,
      history: this.history.slice(),
      logs: this.logs.slice(),
      artifact: context.artifact,
    };
    const results = this.gateEngine.evaluate(def.requires, ctx);
    return { evaluated: true, results };
  }

  private buildHistoryItem(context: TransitionContext): TransitionHistoryItem {
    const now = new Date();
    const id = randomUUID();
    const artifactRef = `${context.from}->${context.to}`;
    const previous = this.history.length > 0 ? this.history[this.history.length - 1] : undefined;
    const previousHash = previous?.evidence.hash;

    const base = {
      type: 'transition-hash' as const,
      artifactRef,
      author: context.authorizedBy.actorId,
      timestamp: now.toISOString(),
      source: 'state-machine',
      id,
      from: context.from,
      to: context.to,
      previousHash,
    };
    const { hash } = newE1(base, previousHash);

    return {
      id,
      from: context.from,
      to: context.to,
      at: now.toISOString(),
      authorizedBy: { ...context.authorizedBy },
      comment: context.comment,
      evidence: {
        id,
        level: 'E1',
        type: 'transition-hash',
        artifactRef,
        author: context.authorizedBy.actorId,
        timestamp: now.toISOString(),
        source: 'state-machine',
        algorithm: 'SHA-256',
        hash,
        previousHash,
        canonicalPayloadVersion: '1',
        createdAt: now.toISOString(),
      },
    };
  }

  private buildSnapshot(state: StatePersistence, version: number): FullSnapshot {
    const payload: Omit<FullSnapshot, 'checksum' | 'savedAt'> = {
      version,
      machineVersion: this.machine.version,
      instanceId: this.instanceId,
      state,
      logs: this.logs.slice(),
      secrets: [],
      aliases: [],
      templates: [],
    };
    return {
      ...payload,
      checksum: sha256(JSON.stringify(payload, Object.keys(payload).sort())),
      savedAt: new Date().toISOString(),
    };
  }

  private emitTransitionEvent(item: TransitionHistoryItem): void {
    if (!this.bus) return;
    this.bus.emit({
      type: 'state:transition',
      payload: {
        id: item.id,
        from: item.from,
        to: item.to,
        at: item.at,
        authorizedBy: item.authorizedBy.roles.slice(),
        comment: item.comment,
      },
    });
  }
}