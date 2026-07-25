import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { CheckResult } from '../types/index.js';

export class AuditService {
  async runSprintAudit(): Promise<{
    date: string;
    status: string;
    checks: CheckResult[];
    summary: { passed: number; failed: number; total: number };
  }> {
    const { ValidatorService } = await import('./validator.service.js');
    const { RegistryService } = await import('./registry.service.js');
    const registry = new RegistryService();
    const validator = new ValidatorService(registry);

    const results = [
      await validator.validateManifest(),
      ...await validator.validateProjectStructure(),
      ...await validator.checkQualityGates(),
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
