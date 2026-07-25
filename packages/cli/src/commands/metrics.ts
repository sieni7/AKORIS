import { Command } from 'commander';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { RegistryService } from '../services/registry.service.js';

export const metricsCommand = new Command('metrics')
  .description('Show and manage project metrics')
  .addCommand(
    new Command('run')
      .description('Show current metrics from registry definitions')
      .action(() => {
        try {
          const registry = new RegistryService();
          const metricsDef = registry.getMetrics();
          if (!metricsDef) {
            console.log('No metrics defined in the Registry');
            return;
          }
          console.log('📊 Current Metrics\n');
          for (const metric of metricsDef.metrics) {
            console.log(`  📈 ${metric.name}`);
            console.log(`     Type: ${metric.type}`);
            console.log(`     ${metric.description}\n`);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('history')
      .description('Show metrics history from .akoris/metrics/')
      .action(() => {
        try {
          const metricsDir = resolve(process.cwd(), '.akoris', 'metrics');
          if (!existsSync(metricsDir)) {
            console.log('No .akoris/metrics/ directory found');
            return;
          }
          const files = readdirSync(metricsDir).filter(f => f.endsWith('.json')).sort();
          if (files.length === 0) {
            console.log('No metrics history found');
            return;
          }
          console.log('📊 Metrics History\n');
          for (const file of files) {
            const data = JSON.parse(readFileSync(join(metricsDir, file), 'utf-8'));
            console.log(`  📁 ${file}`);
            if (data.metrics) {
              for (const m of data.metrics) {
                console.log(`     ${m.name}: ${m.value}`);
              }
            }
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
    new Command('export')
      .description('Export metrics to JSON')
      .option('--output <path>', 'Output file path')
      .action((options?: { output?: string }) => {
        try {
          const registry = new RegistryService();
          const metricsDef = registry.getMetrics();
          if (!metricsDef) {
            console.log('No metrics defined in the Registry');
            return;
          }
          const output = options?.output || join(process.cwd(), '.akoris', 'metrics', 'export.json');
          const dir = dirname(output);
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          writeFileSync(output, JSON.stringify(metricsDef, null, 2));
          console.log(`✅ Metrics exported to ${output}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`❌ ${message}`);
          process.exit(1);
        }
      }),
  );
