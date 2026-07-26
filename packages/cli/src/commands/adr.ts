import { Command } from 'commander';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { RegistryService } from '../services/registry.service.js';
import { success, error, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

export const adrCommand = new Command('adr')
  .description('Manage Architecture Decision Records')
  .addCommand(
    new Command('new')
      .description('Create a new ADR from registry template')
      .argument('[title]', 'ADR title')
      .action(async (title?: string) => {
        try {
          const decisionsDir = resolve(process.cwd(), '.akoris', 'decisions');
          if (!existsSync(decisionsDir)) mkdirSync(decisionsDir, { recursive: true });

          const existing = readdirSync(decisionsDir).filter(f => f.startsWith('ADR-')).length;
          const id = `ADR-${String(existing + 1).padStart(3, '0')}`;
          const registry = new RegistryService();
          const templates = registry.getTemplates();
          const template = templates.find(t => /adr/i.test(t.name))
            || { name: 'default.md', content: `# ${id}: ${title || 'Untitled'}\n\nStatus: proposed\n\n## Context\n\n## Decision\n\n## Consequences\n` };

          const content = template.content.replace(/\{\{ADR_ID\}\}/g, id);
          writeFileSync(join(decisionsDir, `${id}.md`), content);
          if (shouldOutputJSON()) {
            printJSON({ id, path: join(decisionsDir, `${id}.md`) });
            return;
          }
          success(`${id}.md created`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('list')
      .description('List all ADRs in .akoris/decisions/')
      .action(() => {
        try {
          const decisionsDir = resolve(process.cwd(), '.akoris', 'decisions');
          if (!existsSync(decisionsDir)) {
            info('No .akoris/decisions/ directory found');
            return;
          }
          const files = readdirSync(decisionsDir).filter(f => /^ADR-\d+\.md$/i.test(f));
          if (files.length === 0) {
            info('No ADRs found');
            return;
          }
          if (shouldOutputJSON()) {
            const adrs = files.sort().map(file => {
              const content = readFileSync(join(decisionsDir, file), 'utf-8');
              const title = content.split('\n')[0]?.replace(/^#\s*/, '') || file;
              return { file, title };
            });
            printJSON(adrs);
            return;
          }
          log('📋 Architecture Decision Records\n');
          for (const file of files.sort()) {
            const content = readFileSync(join(decisionsDir, file), 'utf-8');
            const title = content.split('\n')[0]?.replace(/^#\s*/, '') || file;
            log(`  ${file}  ${title}`);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('show')
      .description('Show a specific ADR')
      .argument('<id>', 'ADR ID (e.g., ADR-004)')
      .action((id: string) => {
        try {
          const file = join(resolve(process.cwd(), '.akoris', 'decisions'), `${id}.md`);
          if (!existsSync(file)) {
            error(`${id} not found in .akoris/decisions/`);
            process.exit(1);
          }
          if (shouldOutputJSON()) {
            printJSON({ id, content: readFileSync(file, 'utf-8') });
            return;
          }
          log(readFileSync(file, 'utf-8'));
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('export')
      .description('Export all ADRs (placeholder)')
      .action(() => {
        info('ADR export - placeholder');
      }),
  );
