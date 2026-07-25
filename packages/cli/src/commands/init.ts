import { Command } from 'commander';
import { GeneratorService } from '../services/generator.service.js';

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
      console.log(`✅ Projet AKORIS initialisé : ${projectName}`);
      console.log(`📁 ${projectPath}`);
      console.log('\n📋 Prochaines étapes :');
      console.log('   a koris install <playbook>  - Installer un playbook');
      console.log('   a koris doctor             - Diagnostiquer le projet');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });
