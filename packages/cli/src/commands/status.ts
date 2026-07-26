import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';
import { ManifestService } from '../services/manifest.service.js';
import { shouldOutputJSON, printJSON, title, header, info, warn, log } from '../output/format.js';

export const statusCommand = new Command('status')
  .description('Affiche l\'état global du projet AKORIS')
  .action(() => {
    const manifestService = new ManifestService();
    const registry = new RegistryService();

    if (shouldOutputJSON()) {
      printJSON({
        manifest: manifestService.exists() ? manifestService.read() : null,
        registry: registry.summary(),
      });
      return;
    }

    title('État AKORIS');

    if (manifestService.exists()) {
      const manifest = manifestService.read();
      log(`📄 Projet : ${manifest.name} v${manifest.version}`);
      log(`   Méthode : AKORIS ${manifest.akoris}`);
      log(`   Registry: v${manifest.registry.version}`);
      log(`   Playbook: ${manifest.playbook || 'aucun'}`);
      log(`   Type    : ${manifest.projectType || 'non défini'}`);
    } else {
      warn('Aucun MANIFEST.json trouvé');
    }

    const summary = registry.summary();
    header('Registry');
    log(`   ${summary.policies} policies`);
    log(`   ${summary.agents} agents`);
    log(`   ${summary.contracts} contrats`);
    log(`   ${summary.workflows} workflows`);
    log(`   ${summary.qualityGates} quality gates`);
    log(`   ${summary.metrics} métriques`);
    log(`   ${summary.checklists} checklists`);
    log(`   ${summary.templates} templates`);
  });
