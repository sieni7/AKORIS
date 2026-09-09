import type { FullSnapshot, SnapshotPersister, StateMachine } from '../../src/types.js';

export const TEST_MACHINE: StateMachine = {
  version: '1.0.1',
  schema: 'state-machine.schema.json',
  initialState: 'PROPOSITION',
  terminalStates: ['ARCHIVED'],
  states: [
    { id: 'PROPOSITION', phase: 'initiation' },
    { id: 'DRAFT', phase: 'specification' },
    { id: 'PLANNED', phase: 'planification' },
    { id: 'ACTIVE', phase: 'execution' },
    { id: 'AUDIT', phase: 'controle' },
    { id: 'VALIDATED', phase: 'approbation' },
    { id: 'RELEASED', phase: 'production' },
    { id: 'ARCHIVED', phase: 'cloture' },
  ],
  transitions: [
    { from: 'PROPOSITION', to: 'DRAFT', requires: ['QG-PROPOSITION'], required: true, authorizedBy: ['VALIDATOR'] },
    { from: 'DRAFT', to: 'PLANNED', requires: ['QG-DRAFT'], required: true, authorizedBy: ['VALIDATOR'] },
    { from: 'PLANNED', to: 'ACTIVE', requires: ['QG-PLANNED'], required: true, authorizedBy: ['VALIDATOR'] },
    { from: 'ACTIVE', to: 'AUDIT', requires: ['QG-ACTIVE'], required: true, authorizedBy: ['VALIDATOR'] },
    { from: 'AUDIT', to: 'VALIDATED', requires: ['QG-AUDIT'], required: true, authorizedBy: ['VALIDATOR'] },
    { from: 'VALIDATED', to: 'RELEASED', requires: ['QG-VALIDATED'], required: true, authorizedBy: ['HUMAN_DECISION'] },
    { from: 'RELEASED', to: 'ARCHIVED', requires: [], required: false, authorizedBy: ['MAINTAINER'] },
  ],
  exceptionStates: {
    BLOCKED: { from: ['DRAFT', 'PLANNED', 'ACTIVE', 'AUDIT'], to: ['ACTIVE', 'REJECTED'] },
    REJECTED: { from: ['DRAFT', 'PLANNED', 'ACTIVE', 'AUDIT', 'VALIDATED'], to: ['ARCHIVED'] },
    SUPERSEDED: { from: ['ACTIVE', 'VALIDATED', 'RELEASED'], to: ['ARCHIVED'] },
  },
};

/**
 * Persister de test in-memory : version optimiste stricte (§4.12).
 * `saveSnapshotIfVersion` renvoie CONFLICT si la version attendue ne correspond
 * pas à la dernière version persistée. Aucun merge (I-6).
 */
export class FakePersister implements SnapshotPersister {
  private store: Map<number, FullSnapshot> = new Map();
  private current: number = 0;

  async saveSnapshotIfVersion(
    expectedVersion: number,
    snapshot: FullSnapshot,
  ): Promise<{ success: true } | { success: false; currentVersion: number; error: 'CONFLICT' }> {
    if (expectedVersion !== this.current) {
      return { success: false, currentVersion: this.current, error: 'CONFLICT' };
    }
    this.store.set(snapshot.version, { ...snapshot });
    this.current = snapshot.version;
    return { success: true };
  }

  async loadSnapshot(): Promise<FullSnapshot | null> {
    return this.current === 0 ? null : structuredClone(this.store.get(this.current)!);
  }

  get latest(): number {
    return this.current;
  }
}