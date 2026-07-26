import { Command } from 'commander';
import { GeneratorService } from '../services/generator.service.js';
import { success, error, info, log, warn, shouldOutputJSON, printJSON } from '../output/format.js';

export const docsCommand = new Command('docs')
  .description('Manage project documentation')
  .addCommand(
    new Command('generate')
      .description('Generate documentation from templates (placeholder)')
      .action(() => {
        info('Documentation generation - placeholder');
      }),
  )
  .addCommand(
    new Command('validate')
      .description('Validate documentation structure')
      .action(async () => {
        try {
          const { ValidatorService } = await import('../services/validator.service.js');
          const { RegistryService } = await import('../services/registry.service.js');
          const registry = new RegistryService();
          const validator = new ValidatorService(registry);
          const checks = await validator.validateProjectStructure();
          const passed = checks.filter(c => c.passed).length;
          if (shouldOutputJSON()) {
            printJSON({ checks, summary: { passed, total: checks.length } });
            return;
          }
          log('📋 Documentation Validation\n');
          for (const check of checks) {
            log(`${check.passed ? '✅' : '❌'} ${check.name}`);
            if (check.details) log(`   ${check.details}`);
          }
          log(`\n📊 ${passed}/${checks.length} checks passed`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('export')
      .description('Export docs to format')
      .argument('<format>', 'Export format (pdf, html, markdown)')
      .action((format: string) => {
        const valid = ['pdf', 'html', 'markdown'];
        if (!valid.includes(format)) {
          error(`Invalid format. Use: ${valid.join(', ')}`);
          process.exit(1);
        }
        if (shouldOutputJSON()) {
          printJSON({ format, status: 'placeholder' });
          return;
        }
        info(`Documentation export to ${format} - placeholder`);
      }),
  );
