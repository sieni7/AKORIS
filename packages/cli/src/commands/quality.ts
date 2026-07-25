import { Command } from 'commander';
import { QualityService } from '../services/quality.service.js';
import { RegistryService } from '../services/registry.service.js';

export const qualityCommand = new Command('quality')
  .description('Run quality checks and manage quality gates')
  .addCommand(
    new Command('check')
      .description('Run quality checks')
      .action(async () => {
        try {
          const qualityService = new QualityService();
          console.log('🔍 Running quality checks...\n');
          const result = await qualityService.runAllChecks();
          for (const gate of result.gates) {
            console.log(`${gate.passed ? '✅' : '❌'} ${gate.name}`);
            if (gate.details) console.log(`   ${gate.details}`);
          }
          console.log(`\n📊 ${result.summary.passed}/${result.summary.total} gates passed`);
          console.log(`\n${result.overall === 'passed' ? '✅' : '⚠️'} Overall quality: ${result.overall}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
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
            console.log('No quality gates defined in the Registry');
            return;
          }
          console.log('📋 Quality Gates\n');
          for (const gate of gates.gates) {
            console.log(`  ${gate.critical ? '🔴' : '🟡'} ${gate.name}`);
            console.log(`     ${gate.description}`);
            console.log(`     Type: ${gate.type} | Critical: ${gate.critical}`);
            console.log();
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
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
          console.log('🔍 Validating project against all gates...\n');
          const result = await qualityService.runAllChecks();
          for (const gate of result.gates) {
            console.log(`${gate.passed ? '✅' : '❌'} ${gate.name}`);
            if (gate.details) console.log(`   ${gate.details}`);
          }
          console.log(`\n📊 ${result.summary.passed}/${result.summary.total} gates passed`);
          if (result.overall === 'passed') {
            console.log('\n✅ All gates passed');
          } else {
            console.log('\n⚠️ Some gates failed');
            process.exitCode = 1;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
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
            console.log('No quality metrics defined');
            return;
          }
          const qualityMetrics = metricsDef.metrics.filter((m: any) =>
            /quality|coverage|gate|test/i.test(m.name),
          );
          if (qualityMetrics.length === 0) {
            console.log('No quality-related metrics found');
            return;
          }
          console.log('📊 Quality Metrics\n');
          for (const metric of qualityMetrics) {
            console.log(`  📈 ${metric.name}`);
            console.log(`     Type: ${metric.type}`);
            console.log(`     ${metric.description}`);
            console.log();
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  );
