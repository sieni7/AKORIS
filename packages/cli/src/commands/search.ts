import { Command } from 'commander';
import { SearchEngine } from '@akoris/core';
import { getProjectRoot } from '../services/project.service.js';
import { error, warn, info, title, printJSON, shouldOutputJSON, log } from '../output/format.js';

export function searchCommand(): Command {
  return new Command('search')
    .description('Recherche unifiée dans le Registre AKORIS (agents, règles, ADRs, logs, capacités)')
    .argument('<query>', 'Terme de recherche')
    .option('--type <type>', 'Type de résultat')
    .action(async (query: string, options: { type?: string }) => {
      const projectRoot = getProjectRoot();
      const engine = new SearchEngine(projectRoot);
      const results = await engine.search(query);

      if (shouldOutputJSON()) {
        const byType: Record<string, typeof results> = {};
        for (const r of results) {
          if (!byType[r.type]) byType[r.type] = [];
          byType[r.type].push(r);
        }
        printJSON({ query, count: results.length, results, byType });
        return;
      }

      if (results.length === 0) {
        warn(`Aucun résultat pour "${query}"`);
        info('Essayez un terme plus général ou vérifiez l\'orthographe.');
        return;
      }

      title(`Résultats pour "${query}" (${results.length})`);

      const groups = new Map<string, typeof results>();
      for (const r of results) {
        const group = groups.get(r.type) || [];
        group.push(r);
        groups.set(r.type, group);
      }

      for (const [type, items] of groups) {
        info(`\n${type} (${items.length}) :`);
        for (const item of items) {
          log(item.preview || `${item.id} (score: ${item.score})`);
        }
      }
    });
}
