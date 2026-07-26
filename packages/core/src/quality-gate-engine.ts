import type { GateStatus, LogEntry, TransitionHistoryItem } from './types.js';

export interface GateEvaluator {
  id: string;
  description: string;
  evaluate(params: GateContext): 'PASS' | 'FAIL' | 'PENDING' | 'SKIPPED';
}

export interface GateContext {
  logs: LogEntry[];
  history: TransitionHistoryItem[];
  currentState: string;
}

const DEFAULT_EVALUATORS: GateEvaluator[] = [
  {
    id: 'gate-plan-approved',
    description: 'Project plan has been approved',
    evaluate: (ctx) => ctx.currentState !== 'ideation' ? 'PASS' : 'PENDING',
  },
  {
    id: 'gate-code-complete',
    description: 'Development code is complete',
    evaluate: (ctx) => {
      const recent = ctx.history.filter((h) => h.from === 'development' || h.to === 'development');
      return recent.length >= 1 ? 'PASS' : 'PENDING';
    },
  },
  {
    id: 'gate-review-passed',
    description: 'Code review has passed',
    evaluate: (ctx) => {
      const reviews = ctx.history.filter((h) => h.to === 'staging' || h.from === 'review');
      return reviews.length >= 1 ? 'PASS' : 'PENDING';
    },
  },
  {
    id: 'gate-quality-passed',
    description: 'Quality metrics meet thresholds',
    evaluate: (ctx) => {
      const recentErrors = ctx.logs.filter((l) => l.level === 'error').length;
      return recentErrors < 3 ? 'PASS' : 'FAIL';
    },
  },
  {
    id: 'gate-staging-passed',
    description: 'Staging verification passed',
    evaluate: (ctx) => {
      const stagingEntries = ctx.history.filter((h) => h.to === 'production' || h.from === 'staging');
      return stagingEntries.length >= 1 ? 'PASS' : 'PENDING';
    },
  },
  {
    id: 'gate-security-passed',
    description: 'Security checks passed',
    evaluate: (ctx) => {
      const recentErrors = ctx.logs.filter((l) => l.level === 'error' && l.message.toLowerCase().includes('security')).length;
      return recentErrors === 0 ? 'PASS' : 'FAIL';
    },
  },
];

export class QualityGateEngine {
  private evaluators: Map<string, GateEvaluator>;

  constructor(evaluators?: GateEvaluator[]) {
    this.evaluators = new Map((evaluators ?? DEFAULT_EVALUATORS).map((e) => [e.id, e]));
  }

  evaluate(gateIds: string[], context: GateContext): GateStatus[] {
    return gateIds.map((gateId) => {
      const evaluator = this.evaluators.get(gateId);
      if (!evaluator) return { gateId, status: 'SKIPPED', details: `No evaluator found for gate '${gateId}'` };
      const status = evaluator.evaluate(context);
      return { gateId, status, details: status === 'PASS' ? evaluator.description : `Gate '${gateId}' not yet satisfied` };
    });
  }

  allPassed(gateIds: string[], context: GateContext): boolean {
    return this.evaluate(gateIds, context).every((g) => g.status === 'PASS');
  }
}
