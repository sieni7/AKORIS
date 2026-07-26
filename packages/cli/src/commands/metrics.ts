import { Command } from 'commander';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { success, error, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

export const metricsCommand = new Command('metrics')
  .description('Show and manage project metrics');

metricsCommand
  .command('history')
  .description('Show metrics history from .akoris/metrics/')
  .action(() => {
    try {
      const metricsDir = resolve(process.cwd(), '.akoris', 'metrics');
      if (!existsSync(metricsDir)) {
        info('No .akoris/metrics/ directory found');
        return;
      }
      const files = readdirSync(metricsDir).filter(f => f.endsWith('.json')).sort();
      if (files.length === 0) {
        info('No metrics history found');
        return;
      }
      if (shouldOutputJSON()) {
        const history = files.map(file => ({
          file,
          data: JSON.parse(readFileSync(join(metricsDir, file), 'utf-8')),
        }));
        printJSON(history);
        return;
      }
      log('Metrics History\n');
      for (const file of files) {
        const data = JSON.parse(readFileSync(join(metricsDir, file), 'utf-8'));
        log(`  ${file}`);
        if (data.metrics) {
          for (const m of data.metrics) {
            log(`     ${m.name}: ${m.value}`);
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      error(`${message}`);
      process.exit(1);
    }
  })

  .command('export')
  .description('Export metrics to JSON')
  .option('--output <path>', 'Output file path')
  .action((options?: { output?: string }) => {
    try {
      const metricsPath = join(process.cwd(), 'registry', 'metrics.json');
      let metricsDef = null;
      try {
        metricsDef = JSON.parse(readFileSync(metricsPath, 'utf-8'));
      } catch {
        info('No metrics definition found in Registry');
        return;
      }
      const output = options?.output || join(process.cwd(), '.akoris', 'metrics', 'export.json');
      const dirPath = dirname(output);
      if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
      writeFileSync(output, JSON.stringify(metricsDef, null, 2));
      if (shouldOutputJSON()) {
        printJSON({ exported: true, path: output });
        return;
      }
      success(`Metrics exported to ${output}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      error(`${message}`);
      process.exit(1);
    }
  });
