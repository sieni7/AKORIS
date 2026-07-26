import { Command } from 'commander';
import { QualityService } from '../services/quality.service.js';
import { RegistryService } from '../services/registry.service.js';
import { success, error, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

export const qualityCommand = new Command('quality')
  .description('Run quality checks and manage quality gates')
  .addCommand(
    new Command('check')
      .description('Run quality checks')
      .action(async () => {
        try {
          const qualityService = new QualityService();
          info('Running quality checks...');
          const result = await qualityService.runAllChecks();
          if (shouldOutputJSON()) {
            printJSON(result);
            return;
          }
          for (const gate of result.gates) {
            log(`${gate.passed ? '✅' : '❌'} ${gate.name}`);
            if (gate.details) log(`   ${gate.details}`);
          }
          log(`\n📊 ${result.summary.passed}/${result.summary.total} gates passed`);
          if (result.overall === 'passed') success(`Overall quality: ${result.overall}`);
          else warn(`Overall quality: ${result.overall}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('gates')
      .description('List quality gates')
      .action(() => {
        try {
          const qualityService = new QualityService();
          const gates = qualityService.getGateDefinitions();
          if (!gates) {
            info('No quality gates defined in the Registry');
            return;
          }
          if (shouldOutputJSON()) {
            printJSON(gates);
            return;
          }
          log('📋 Quality Gates\n');
          for (const gate of gates.gates) {
            log(`  ${gate.critical ? '🔴' : '🟡'} ${gate.name}`);
            log(`     ${gate.description}`);
            log(`     Type: ${gate.type} | Critical: ${gate.critical}`);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('validate')
      .description('Validate project against all gates')
      .action(async () => {
        try {
          const qualityService = new QualityService();
          info('Validating project against all gates...');
          const result = await qualityService.runAllChecks();
          if (shouldOutputJSON()) {
            printJSON(result);
            return;
          }
          for (const gate of result.gates) {
            log(`${gate.passed ? '✅' : '❌'} ${gate.name}`);
            if (gate.details) log(`   ${gate.details}`);
          }
          log(`\n📊 ${result.summary.passed}/${result.summary.total} gates passed`);
          if (result.overall === 'passed') success('All gates passed');
          else {
            warn('Some gates failed');
            process.exitCode = 1;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('metrics')
      .description('Show quality metrics')
      .action(() => {
        try {
          const registry = new RegistryService();
          const metricsDef = registry.getMetrics();
          if (!metricsDef) {
            info('No quality metrics defined');
            return;
          }
          const qualityMetrics = metricsDef.metrics.filter((m: any) =>
            /quality|coverage|gate|test/i.test(m.name),
          );
          if (qualityMetrics.length === 0) {
            info('No quality-related metrics found');
            return;
          }
          if (shouldOutputJSON()) {
            printJSON(qualityMetrics);
            return;
          }
          log('📊 Quality Metrics\n');
          for (const metric of qualityMetrics) {
            log(`  📈 ${metric.name}`);
            log(`     Type: ${metric.type}`);
            log(`     ${metric.description}`);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  );
