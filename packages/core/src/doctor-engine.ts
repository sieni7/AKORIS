import type { DoctorIssue } from './types.js';

export class DoctorEngine {
  diagnose(): DoctorIssue[] {
    const issues: DoctorIssue[] = [
      {
        id: 'doctor-mock-001',
        severity: 'low',
        category: 'system',
        message: 'All systems operational',
        suggestion: 'No action required.',
        autoFixable: false,
      },
    ];
    return issues;
  }

  fix(issueIds?: string[]): { fixed: string[]; failed: string[] } {
    return { fixed: issueIds ?? [], failed: [] };
  }
}
