import { Command } from 'commander';
import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { GeneratorService } from '../services/generator.service.js';
import { ManifestService } from '../services/manifest.service.js';

export const playbookCommand = new Command('playbook')
  .description('Gère les playbooks AKORIS');

playbookCommand
  .command('list')
  .description('Liste les playbooks disponibles')
  .action(() => {
    const playbooksDir = resolve(process.cwd(), 'playbooks');

    if (!existsSync(playbooksDir)) {
      console.log('⚠️  Aucun dossier playbooks/ trouvé');
      return;
    }

    const entries = readdirSync(playbooksDir, { withFileTypes: true });
    const playbooks = entries.filter(e => e.isDirectory()).map(e => e.name);

    if (playbooks.length === 0) {
      console.log('ℹ️  Aucun playbook disponible');
      return;
    }

    console.log('📋 Playbooks disponibles :\n');
    for (const pb of playbooks) {
      console.log(`   📘 ${pb}`);
    }
  });

playbookCommand
  .command('install')
  .description('Installe un playbook')
  .argument('<name>', 'Nom du playbook')
  .action(async (name: string) => {
    try {
      const generator = new GeneratorService();
      const playbookPath = resolve(process.cwd(), 'playbooks', name);

      if (!existsSync(playbookPath)) {
        console.error(`❌ Playbook "${name}" introuvable dans playbooks/`);
        process.exit(1);
      }

      await generator.installPlaybook(playbookPath, process.cwd());
      console.log(`✅ Playbook "${name}" installé`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });

playbookCommand
  .command('remove')
  .description('Supprime un playbook installé')
  .argument('<name>', 'Nom du playbook')
  .action((name: string) => {
    const manifestService = new ManifestService();

    if (!manifestService.exists()) {
      console.error('❌ Aucun MANIFEST.json trouvé');
      process.exit(1);
    }

    const manifest = manifestService.read();

    if (manifest.playbook !== name) {
      console.error(`❌ Le playbook actuel est "${manifest.playbook}", pas "${name}"`);
      process.exit(1);
    }

    manifest.playbook = undefined;
    manifestService.write(manifest);

    console.log(`✅ Playbook "${name}" retiré du manifeste`);
    console.log('ℹ️  Les fichiers copiés dans .akoris/ doivent être supprimés manuellement');
  });

playbookCommand
  .command('current')
  .description('Affiche le playbook actif depuis MANIFEST.json')
  .action(() => {
    const manifestService = new ManifestService();

    if (!manifestService.exists()) {
      console.log('⚠️  Aucun MANIFEST.json trouvé');
      return;
    }

    const manifest = manifestService.read();

    if (!manifest.playbook) {
      console.log('ℹ️  Aucun playbook défini dans le manifeste');
      return;
    }

    console.log(`📘 Playbook actif : ${manifest.playbook}`);
  });
