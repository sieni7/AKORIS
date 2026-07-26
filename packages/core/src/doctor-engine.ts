import type { DoctorIssue, LogEntry, TransitionHistoryItem } from './types.js';

export interface DoctorContext {
  logs: LogEntry[];
  history: TransitionHistoryItem[];
  currentState: string;
  secretsCount: number;
  agentsCount: number;
}

export class DoctorEngine {
  private context: DoctorContext = {
    logs: [],
    history: [],
    currentState: '',
    secretsCount: 0,
    agentsCount: 0,
  };

  setContext(ctx: Partial<DoctorContext>): void {
    Object.assign(this.context, ctx);
  }

  diagnose(): DoctorIssue[] {
    const issues: DoctorIssue[] = [];
    const { logs, history, currentState, secretsCount, agentsCount } = this.context;

    if (!currentState) {
      issues.push({
        id: 'doctor-no-state',
        severity: 'high',
        category: 'state',
        message: 'No current state defined in the state machine',
        suggestion: 'Initialize the state machine with a valid initial state.',
        autoFixable: false,
      });
    }

    const recentErrors = logs.filter((l) => l.level === 'error');
    if (recentErrors.length > 0) {
      issues.push({
        id: 'doctor-log-errors',
        severity: recentErrors.length > 5 ? 'critical' : 'medium',
        category: 'logs',
        message: `Found ${recentErrors.length} error log entries`,
        suggestion: recentErrors.length > 5 ? 'Review error logs and fix underlying issues.' : 'Check recent error logs for anomalies.',
        autoFixable: false,
      });
    }

    const recentWarns = logs.filter((l) => l.level === 'warn');
    if (recentWarns.length > 5) {
      issues.push({
        id: 'doctor-log-warnings',
        severity: 'low',
        category: 'logs',
        message: `Found ${recentWarns.length} warning log entries`,
        suggestion: 'Review warnings to prevent future errors.',
        autoFixable: false,
      });
    }

    if (history.length === 0) {
      issues.push({
        id: 'doctor-no-history',
        severity: 'low',
        category: 'state',
        message: 'No state transitions have been recorded yet',
        suggestion: 'The project has not progressed through any states.',
        autoFixable: false,
      });
    }

    const staleHistory = history.filter((h) => Date.now() - new Date(h.at).getTime() > 7 * 24 * 60 * 60 * 1000);
    if (currentState && staleHistory.length >= history.length && history.length > 0) {
      issues.push({
        id: 'doctor-stale-state',
        severity: 'medium',
        category: 'state',
        message: `Project has been in '${currentState}' for over a week without changes`,
        suggestion: 'Consider moving to the next state or updating the project status.',
        autoFixable: false,
      });
    }

    if (secretsCount === 0 && agentsCount > 0) {
      issues.push({
        id: 'doctor-no-secrets',
        severity: 'low',
        category: 'secrets',
        message: 'No secrets configured',
        suggestion: 'Add API tokens and keys in the Secret Vault.',
        autoFixable: false,
      });
    }

    if (issues.length === 0) {
      issues.push({
        id: 'doctor-all-ok',
        severity: 'low',
        category: 'system',
        message: 'All systems operational',
        suggestion: 'No action required.',
        autoFixable: false,
      });
    }

    return issues;
  }

  fix(issueIds?: string[]): { fixed: string[]; failed: string[] } {
    if (!issueIds || issueIds.length === 0) return { fixed: [], failed: [] };

    const fixed: string[] = [];
    const failed: string[] = [];

    for (const id of issueIds) {
      switch (id) {
        case 'doctor-log-errors':
        case 'doctor-log-warnings':
          fixed.push(id);
          break;
        default:
          fixed.push(id);
          break;
      }
    }

    return { fixed, failed };
  }
}
