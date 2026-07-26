import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { RegistryReader } from '@akoris/core';
import type { CheckResult } from '../types/index.js';

export class AuditService {
  private projectRoot: string;

  constructor(projectRoot?: string) {
    this.projectRoot = projectRoot || process.cwd();
  }

  async runSprintAudit(): Promise<{
    date: string;
    status: string;
    checks: CheckResult[];
    summary: { passed: number; failed: number; total: number };
  }> {
    const registry = new RegistryReader(this.projectRoot);
    const { ValidatorService } = await import('./validator.service.js');
    const validator = new ValidatorService(this.projectRoot);

    const results = [
      ...await validator.validateProjectStructure(),
      ...await validator.validateManifest().then(r => [r]),
    ];

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    return {
      date: new Date().toISOString(),
      status: failed === 0 ? 'passed' : 'failed',
      checks: results,
      summary: { passed, failed, total: results.length },
    };
  }

  saveReport(report: any, projectPath: string = process.cwd()): string {
    const auditDir = join(projectPath, '.akoris', 'audits');
    if (!existsSync(auditDir)) mkdirSync(auditDir, { recursive: true });
    const filename = `audit-${Date.now()}.json`;
    writeFileSync(join(auditDir, filename), JSON.stringify(report, null, 2));
    return filename;
  }
}
