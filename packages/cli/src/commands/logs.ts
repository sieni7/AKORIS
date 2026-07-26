import { Command } from 'commander';
import { LogReader } from '../services/log-reader.service.js';
import { shouldOutputJSON, printJSON, title, info, warn, log, isVerbose } from '../output/format.js';

export const logsCommand = new Command('logs')
  .description('Affiche les logs d\'exécution du projet AKORIS')
  .option('--lines <n>', 'Nombre de lignes (défaut: 20)', '20')
  .option('--agent <id>', 'Filtrer par ID d\'agent')
  .option('--since <date>', 'Filtrer depuis une date (ISO, ex: 2026-06-01)')
  .option('--watch', 'Mode suivi (tail -f) — non implémenté')
  .action((options: { lines?: string; agent?: string; since?: string; watch?: boolean }) => {
    const reader = new LogReader();
    const filter = {
      agent: options.agent,
      since: options.since,
      lines: parseInt(options.lines || '20', 10),
    };

    const entries = reader.readLogs(filter);

    if (shouldOutputJSON()) {
      printJSON({ entries, count: entries.length, filter });
      return;
    }

    if (options.watch) {
      warn('Mode --watch non implémenté dans cette version');
    }

    if (entries.length === 0) {
      if (options.agent) {
        warn(`Aucun log trouvé pour l'agent "${options.agent}"`);
      } else {
        warn('Aucun log trouvé. Le projet n\'a pas encore généré de logs.');
      }
      return;
    }

    title(`Logs AKORIS (${entries.length} entrées)`);

    if (options.agent) info(`Filtre agent : ${options.agent}`);
    if (options.since) info(`Filtre depuis : ${options.since}`);

    for (const e of entries) {
      const date = e.timestamp.slice(0, 19).replace('T', ' ');
      log(`  [${date}] ${e.agentId.padEnd(10)} ${e.action.padEnd(18)} ${e.details}`);
    }

    if (isVerbose()) {
      info(`Dossier des logs : ${reader['logDir']}`);
    }
  });
