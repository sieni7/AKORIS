import { Command } from 'commander';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { success, error, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

export const knowledgeCommand = new Command('knowledge')
  .description('Manage project knowledge base')
  .addCommand(
    new Command('search')
      .description('Search knowledge base (placeholder)')
      .argument('<query>', 'Search query')
      .action((query: string) => {
        const knowledgeDir = resolve(process.cwd(), '.akoris', 'knowledge');
        if (!existsSync(knowledgeDir)) {
          info('No .akoris/knowledge/ directory found');
          return;
        }
        const files = readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
        info(`Searching for "${query}"...`);
        let found = 0;
        const results: { file: string; title: string }[] = [];
        for (const file of files) {
          const content = readFileSync(join(knowledgeDir, file), 'utf-8');
          if (content.toLowerCase().includes(query.toLowerCase())) {
            const lines = content.split('\n');
            const title = lines[0]?.replace(/^#\s*/, '') || file;
            results.push({ file, title });
            found++;
          }
        }
        if (shouldOutputJSON()) {
          printJSON({ query, results, count: found });
          return;
        }
        if (found === 0) {
          info('No results found');
        } else {
          for (const r of results) {
            log(`  📄 ${r.file} - ${r.title}`);
          }
          log(`\n${found} file(s) matched`);
        }
      }),
  )
  .addCommand(
    new Command('export')
      .description('Export knowledge from .akoris/knowledge/')
      .option('--output <path>', 'Output directory')
      .action((options?: { output?: string }) => {
        try {
          const knowledgeDir = resolve(process.cwd(), '.akoris', 'knowledge');
          if (!existsSync(knowledgeDir)) {
            info('No .akoris/knowledge/ directory found');
            return;
          }
          const outputDir = options?.output || resolve(process.cwd(), '.akoris', 'knowledge-export');
          if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
          const files = readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
          for (const file of files) {
            copyFileSync(join(knowledgeDir, file), join(outputDir, file));
          }
          if (shouldOutputJSON()) {
            printJSON({ exported: files.length, to: outputDir });
            return;
          }
          success(`${files.length} file(s) exported to ${outputDir}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('import')
      .description('Import knowledge from file')
      .argument('<path>', 'Path to knowledge file')
      .action((path: string) => {
        try {
          const source = resolve(process.cwd(), path);
          if (!existsSync(source)) {
            error(`File not found: ${path}`);
            process.exit(1);
          }
          const knowledgeDir = resolve(process.cwd(), '.akoris', 'knowledge');
          if (!existsSync(knowledgeDir)) mkdirSync(knowledgeDir, { recursive: true });
          const dest = join(knowledgeDir, basename(source));
          copyFileSync(source, dest);
          if (shouldOutputJSON()) {
            printJSON({ imported: dest });
            return;
          }
          success(`Knowledge imported to ${dest}`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          error(`${message}`);
          process.exit(1);
        }
      }),
  );
