import { Command } from 'commander';
import { RegistryReader } from '@akoris/core';
import { ManifestService } from '../services/manifest.service.js';
import { getProjectRoot } from '../services/project.service.js';
import { shouldOutputJSON, printJSON, title, header, info, warn, log } from '../output/format.js';

export const statusCommand = new Command('status')
  .description('Affiche l\'état global du projet AKORIS')
  .action(async () => {
    const projectRoot = getProjectRoot();
    const manifestService = new ManifestService(projectRoot);
    const reader = new RegistryReader(projectRoot);

    let index;
    try {
      index = await reader.loadIndex();
    } catch {
      index = null;
    }

    if (shouldOutputJSON()) {
      printJSON({
        manifest: manifestService.exists() ? manifestService.read() : null,
        registry: index,
      });
      return;
    }

    title('État AKORIS');

    if (manifestService.exists()) {
      const manifest = manifestService.read();
      log(`Projet : ${manifest.name} v${manifest.version}`);
      log(`   Méthode : AKORIS ${manifest.akoris}`);
      log(`   Registry: v${manifest.registry.version}`);
      log(`   Playbook: ${manifest.playbook || 'aucun'}`);
      log(`   Type    : ${manifest.projectType || 'non défini'}`);
    } else {
      warn('Aucun MANIFEST.json trouvé');
    }

    if (index && index.components) {
      header('Registry');
      for (const [name, comp] of Object.entries(index.components)) {
        log(`   ${name.padEnd(15)} ${(comp as any).count}`);
      }
    }
  });
