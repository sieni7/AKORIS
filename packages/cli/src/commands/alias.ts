import { Command } from 'commander';
import { getProjectRoot } from '../services/project.service.js';
import { readAliases, setAlias, removeAlias, resolveAlias } from '../services/alias.service.js';
import { success, error, warn, info, title, printJSON, shouldOutputJSON } from '../output/format.js';

export function aliasCommand(): Command {
  const cmd = new Command('alias')
    .description('Gère les alias de commandes AKORIS');

  cmd
    .command('set <name> <command...>')
    .description('Crée ou met à jour un alias')
    .action(async (name: string, command: string[]) => {
      const resolvedCmd = command.join(' ');
      const projectRoot = getProjectRoot();
      try {
        setAlias(projectRoot, name, resolvedCmd);
        success(`Alias "${name}" défini : ${resolvedCmd}`);
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  cmd
    .command('list')
    .description('Liste tous les alias')
    .option('--json', 'Sortie en JSON')
    .action(async (opts) => {
      const projectRoot = getProjectRoot();
      const aliases = readAliases(projectRoot);
      const names = Object.keys(aliases);

      if (shouldOutputJSON()) {
        printJSON({ aliases, count: names.length });
        return;
      }

      if (names.length === 0) {
        warn('Aucun alias défini.');
        info('Pour en créer un : akoris alias set <nom> "<commande>"');
        return;
      }

      title(`Alias AKORIS (${names.length})`);
      console.table(names.map(name => ({ Alias: name, Commande: aliases[name] })));
    });

  cmd
    .command('remove <name>')
    .description('Supprime un alias')
    .action(async (name: string) => {
      const projectRoot = getProjectRoot();
      if (removeAlias(projectRoot, name)) {
        success(`Alias "${name}" supprimé.`);
      } else {
        warn(`Alias "${name}" introuvable.`);
      }
    });

  cmd
    .command('resolve <name>')
    .description('Affiche la commande résolue pour un alias')
    .action(async (name: string) => {
      const projectRoot = getProjectRoot();
      const resolved = resolveAlias(projectRoot, name);
      if (resolved) {
        console.log(resolved);
      } else {
        console.error(`Alias "${name}" introuvable.`);
        process.exit(1);
      }
    });

  return cmd;
}
