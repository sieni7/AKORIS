import type { StateMachine, TransitionDef, TransitionHistoryItem, TransitionResult, LogEntry } from './types.js';
import { TransitionError } from './errors.js';
import { QualityGateEngine } from './quality-gate-engine.js';

export class StateMachineEngine {
  private machine: StateMachine;
  private currentStateId: string;
  private history: TransitionHistoryItem[] = [];
  private gateEngine: QualityGateEngine;
  private logs: LogEntry[] = [];

  constructor(machine: StateMachine, initialStateId?: string, gateEngine?: QualityGateEngine) {
    this.machine = machine;
    this.currentStateId = initialStateId ?? machine.states[0]?.id ?? '';
    if (!this.currentStateId) {
      throw new Error('State machine must have at least one state');
    }
    this.gateEngine = gateEngine ?? new QualityGateEngine();
  }

  setLogs(logs: LogEntry[]): void {
    this.logs = logs;
  }

  loadMachine(): StateMachine {
    return this.machine;
  }

  getCurrentState(): { currentState: string } {
    return { currentState: this.currentStateId };
  }

  getHistory(): TransitionHistoryItem[] {
    return [...this.history];
  }

  transition(from: string, to: string, authorizedBy: string, comment?: string): TransitionResult {
    if (from !== this.currentStateId) {
      throw new TransitionError(from, to, `current state is '${this.currentStateId}', not '${from}'`);
    }

    const transitionDef = this.findTransition(from, to);
    if (!transitionDef) {
      throw new TransitionError(from, to, 'no valid transition exists between these states');
    }

    const gatesStatus = transitionDef.requiredGates.length > 0
      ? this.gateEngine.evaluate(transitionDef.requiredGates, {
          logs: this.logs,
          history: this.history,
          currentState: this.currentStateId,
        })
      : [];

    const failedGates = gatesStatus.filter((g) => g.status === 'FAIL');
    if (failedGates.length > 0) {
      throw new TransitionError(from, to, `required gates failed: ${failedGates.map((g) => g.gateId).join(', ')}`);
    }

    const historyItem: TransitionHistoryItem = {
      id: crypto.randomUUID(),
      from,
      to,
      at: new Date().toISOString(),
      authorizedBy,
      comment,
    };

    this.currentStateId = to;
    this.history.push(historyItem);

    return {
      success: true,
      newState: to,
      history: historyItem,
      gatesStatus,
    };
  }

  private findTransition(from: string, to: string): TransitionDef | undefined {
    return this.machine.transitions.find((t) => t.from === from && t.to === to);
  }
}
