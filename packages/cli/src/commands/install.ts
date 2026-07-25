import { Command } from 'commander';
import { resolve } from 'node:path';
import { GeneratorService } from '../services/generator.service.js';

export const installCommand = new Command('install')
  .description('Installe un playbook ou un agent AKORIS')
  .argument('<type>', 'Type (playbook ou expert)')
  .argument('[name]', 'Nom du playbook ou de l\'expert')
  .action(async (type: string, name?: string) => {
    if (type === 'playbook' && name) {
      const generator = new GeneratorService();
      const playbookPath = resolve(process.cwd(), 'playbooks', name);
      await generator.installPlaybook(playbookPath, process.cwd());
      console.log(`✅ Playbook "${name}" installé`);
    } else if (type === 'expert' && name) {
      console.log(`🔧 Installation de l'expert "${name}"...`);
      console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
    } else {
      console.error('❌ Usage: a koris install playbook <nom>');
      console.error('   a koris install expert <nom>');
      process.exit(1);
    }
  });
