import { Command } from 'commander';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { AuditService } from '../services/audit.service.js';
import { success, error, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

const sharedOptions = (cmd: Command) =>
  cmd
    .option('--strict', 'Fail on any warning')
    .option('--output <path>', 'Save report to path');

function handleResult(report: any, options?: { strict?: boolean; output?: string }) {
  if (shouldOutputJSON()) {
    printJSON(report);
    return;
  }
  for (const check of report.checks) {
    log(`${check.passed ? '✅' : '❌'} ${check.name}`);
    if (check.details) log(`   ${check.details}`);
  }
  log(`\n📊 ${report.summary.passed}/${report.summary.total} checks passed`);
  if (options?.output) {
    const dir = dirname(options.output);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(options.output, JSON.stringify(report, null, 2));
    info(`Report saved to ${options.output}`);
  }
  if (report.status !== 'passed') process.exitCode = 1;
}

export const auditCommand = new Command('audit')
  .description('Run AKORIS audits')
  .addCommand(
    sharedOptions(new Command('sprint'))
      .description('Run a sprint audit')
      .action(async (options?: { strict?: boolean; output?: string }) => {
        try {
          const auditService = new AuditService();
          info('Sprint audit in progress...');
          const report = await auditService.runSprintAudit();
          const filename = auditService.saveReport(report);
          handleResult(report, options);
          info(`Audit saved: .akoris/audits/${filename}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('project'))
      .description('Run a full project audit')
      .action(async (options?: { strict?: boolean; output?: string }) => {
        try {
          const auditService = new AuditService();
          info('Project audit in progress...');
          const report = await auditService.runSprintAudit();
          const filename = auditService.saveReport(report);
          handleResult(report, options);
          info(`Audit saved: .akoris/audits/${filename}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('release'))
      .description('Run a release audit')
      .action(async (options?: { strict?: boolean; output?: string }) => {
        try {
          const auditService = new AuditService();
          info('Release audit in progress...');
          const report = await auditService.runSprintAudit();
          const filename = auditService.saveReport(report);
          handleResult(report, options);
          info(`Release audit saved: .akoris/audits/${filename}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('architecture'))
      .description('Validate architecture decisions')
      .action(async (options?: { strict?: boolean; output?: string }) => {
        try {
          const { ValidatorService } = await import('../services/validator.service.js');
          const { RegistryService } = await import('../services/registry.service.js');
          const registry = new RegistryService();
          const validator = new ValidatorService(registry);
          const result = await validator.validateManifest();
          const report = {
            date: new Date().toISOString(),
            status: result.passed ? 'passed' : 'failed',
            checks: [result],
            summary: { passed: result.passed ? 1 : 0, failed: result.passed ? 0 : 1, total: 1 },
          };
          handleResult(report, options);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('documentation'))
      .description('Validate documentation completeness')
      .action(async (options?: { strict?: boolean; output?: string }) => {
        try {
          const { ValidatorService } = await import('../services/validator.service.js');
          const { RegistryService } = await import('../services/registry.service.js');
          const registry = new RegistryService();
          const validator = new ValidatorService(registry);
          const checks = await validator.validateProjectStructure();
          const passed = checks.filter(c => c.passed).length;
          const report = {
            date: new Date().toISOString(),
            status: passed === checks.length ? 'passed' : 'failed',
            checks,
            summary: { passed, failed: checks.length - passed, total: checks.length },
          };
          handleResult(report, options);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  );
