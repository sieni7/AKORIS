import { Command } from 'commander';
import { SearchEngine } from '../services/search.service.js';
import { error, warn, info, title, printJSON, shouldOutputJSON, isVerbose } from '../output/format.js';

export function searchCommand(): Command {
  return new Command('search')
    .description('Recherche unifiée dans le Registre AKORIS (agents, règles, ADRs, logs, capacités)')
    .argument('<query>', 'Terme de recherche')
    .option('--type <type>', 'Type de résultat (agent, rule, adr, log, capability, deliverable, event)')
    .option('--json', 'Sortie en JSON')
    .option('--verbose', 'Détails de recherche')
    .option('--quiet', 'Réduire la sortie')
    .option('--no-color', 'Désactiver les couleurs')
    .option('--output <file>', 'Exporter vers un fichier')
    .action(async (query: string, options: { type?: string }) => {
      const verbose = isVerbose();

      const engine = new SearchEngine();
      const types = options.type ? options.type.split(',') : undefined;
      const results = engine.search(query, { types });

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
        if (options.type) {
          info(`Types disponibles : agent, rule, adr, log, capability, deliverable, event`);
        }
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
        const label: Record<string, string> = {
          agent: 'Agents', rule: 'Règles', capability: 'Capacités',
          deliverable: 'Livrables', event: 'Événements',
          adr: 'ADRs', log: 'Logs',
        };
        info(`\n${label[type] || type} (${items.length}) :`);
        for (const item of items) {
          const tagStr = item.tags.length ? ` [${item.tags.slice(0, 3).join(', ')}]` : '';
          console.log(`  ${item.id}  ${item.name}${tagStr}`);
          if (verbose) {
            console.log(`       → ${item.description}`);
            console.log(`       → source: ${item.source}`);
          }
        }
      }
    });
}
