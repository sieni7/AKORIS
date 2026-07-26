import { Command } from 'commander';
import { GeneratorService } from '../services/generator.service.js';
import { success, error, info, shouldOutputJSON, printJSON } from '../output/format.js';

export const initCommand = new Command('init')
  .description('Initialise un nouveau projet AKORIS')
  .argument('[name]', 'Nom du projet')
  .option('-t, --type <type>', 'Type de projet (app, saas, api, lib)', 'app')
  .option('-p, --path <path>', 'Chemin du projet', process.cwd())
  .action(async (name?: string, options?: { type: string; path: string }) => {
    const generator = new GeneratorService();
    const projectName = name || 'mon-projet';
    const projectPath = options?.path || process.cwd();

    try {
      await generator.init(projectPath, projectName, options?.type || 'app');
      if (shouldOutputJSON()) {
        printJSON({ projectName, projectPath, type: options?.type || 'app' });
        return;
      }
      success(`Projet AKORIS initialisé : ${projectName}`);
      info(projectPath);
      info('\nProchaines étapes :');
      info('   akoris install <playbook>  - Installer un playbook');
      info('   akoris doctor             - Diagnostiquer le projet');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });
