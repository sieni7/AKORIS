import { Command } from 'commander';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { AuditService } from '../services/audit.service.js';

const sharedOptions = (cmd: Command) =>
  cmd
    .option('--strict', 'Fail on any warning')
    .option('--json', 'Output as JSON')
    .option('--markdown', 'Output as Markdown')
    .option('--output <path>', 'Save report to path');

function handleResult(report: any, options?: { strict?: boolean; json?: boolean; markdown?: boolean; output?: string }) {
  if (options?.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  if (options?.markdown) {
    console.log(`# Audit Report\n\n| Check | Status |\n|-------|--------|\n${report.checks.map((c: any) => `| ${c.name} | ${c.passed ? '✅' : '❌'} |`).join('\n')}`);
    return;
  }
  for (const check of report.checks) {
    console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
    if (check.details) console.log(`   ${check.details}`);
  }
  console.log(`\n📊 ${report.summary.passed}/${report.summary.total} checks passed`);
  if (options?.output) {
    const dir = dirname(options.output);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(options.output, JSON.stringify(report, null, 2));
    console.log(`📁 Report saved to ${options.output}`);
  }
  if (report.status !== 'passed') process.exitCode = 1;
}

export const auditCommand = new Command('audit')
  .description('Run AKORIS audits')
  .addCommand(
    sharedOptions(new Command('sprint'))
      .description('Run a sprint audit')
      .action(async (options?: { strict?: boolean; json?: boolean; markdown?: boolean; output?: string }) => {
        try {
          const auditService = new AuditService();
          console.log('📋 Sprint audit in progress...\n');
          const report = await auditService.runSprintAudit();
          const filename = auditService.saveReport(report);
          handleResult(report, options);
          console.log(`📁 Audit saved: .akoris/audits/${filename}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('project'))
      .description('Run a full project audit')
      .action(async (options?: { strict?: boolean; json?: boolean; markdown?: boolean; output?: string }) => {
        try {
          const auditService = new AuditService();
          console.log('📋 Project audit in progress...\n');
          const report = await auditService.runSprintAudit();
          const filename = auditService.saveReport(report);
          handleResult(report, options);
          console.log(`📁 Audit saved: .akoris/audits/${filename}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('release'))
      .description('Run a release audit')
      .action(async (options?: { strict?: boolean; json?: boolean; markdown?: boolean; output?: string }) => {
        try {
          const auditService = new AuditService();
          console.log('📋 Release audit in progress...\n');
          const report = await auditService.runSprintAudit();
          const filename = auditService.saveReport(report);
          handleResult(report, options);
          console.log(`📁 Release audit saved: .akoris/audits/${filename}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('architecture'))
      .description('Validate architecture decisions')
      .action(async (options?: { strict?: boolean; json?: boolean; markdown?: boolean; output?: string }) => {
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
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    sharedOptions(new Command('documentation'))
      .description('Validate documentation completeness')
      .action(async (options?: { strict?: boolean; json?: boolean; markdown?: boolean; output?: string }) => {
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
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  );
