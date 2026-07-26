import { describe, it, expect } from 'vitest';
import { StateMachineEngine } from '../src/state-machine.js';
import type { StateMachine } from '../src/types.js';

function makeMachine(): StateMachine {
  return {
    version: '1.0.0',
    states: [
      { id: 'draft', name: 'Draft', phase: 'ideation', description: 'Initial draft' },
      { id: 'review', name: 'Review', phase: 'validation', description: 'Under review' },
      { id: 'done', name: 'Done', phase: 'completed', description: 'Completed' },
    ],
    transitions: [
      { from: 'draft', to: 'review', requiredGates: ['gate-1'], authorizedBy: ['lead'], description: 'Submit for review' },
      { from: 'review', to: 'done', requiredGates: ['gate-2'], authorizedBy: ['qa'], description: 'Approve' },
      { from: 'review', to: 'draft', requiredGates: [], authorizedBy: ['lead'], description: 'Send back to draft' },
    ],
  };
}

describe('StateMachineEngine', () => {
  it('should load state machine definition', () => {
    const engine = new StateMachineEngine(makeMachine());
    expect(engine.loadMachine().states).toHaveLength(3);
  });

  it('should return current state', () => {
    const engine = new StateMachineEngine(makeMachine());
    expect(engine.getCurrentState().currentState).toBe('draft');
  });

  it('should execute a valid transition', () => {
    const engine = new StateMachineEngine(makeMachine());
    const result = engine.transition('draft', 'review', 'lead', 'Starting review');
    expect(result.success).toBe(true);
    expect(result.newState).toBe('review');
    expect(result.history.from).toBe('draft');
    expect(result.history.to).toBe('review');
  });

  it('should track history', () => {
    const engine = new StateMachineEngine(makeMachine());
    engine.transition('draft', 'review', 'lead');
    engine.transition('review', 'done', 'qa');
    expect(engine.getHistory()).toHaveLength(2);
  });

  it('should reject invalid transition', () => {
    const engine = new StateMachineEngine(makeMachine());
    expect(() => engine.transition('draft', 'done', 'lead')).toThrow('transition');
  });

  it('should reject transition from wrong current state', () => {
    const engine = new StateMachineEngine(makeMachine());
    expect(() => engine.transition('done', 'draft', 'lead')).toThrow('current state');
  });
});
