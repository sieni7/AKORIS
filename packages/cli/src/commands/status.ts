import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';
import { ManifestService } from '../services/manifest.service.js';

export const statusCommand = new Command('status')
  .description('Affiche l\'état global du projet AKORIS')
  .action(() => {
    const manifestService = new ManifestService();
    const registry = new RegistryService();

    console.log('📊 État AKORIS\n');

    if (manifestService.exists()) {
      const manifest = manifestService.read();
      console.log(`📄 Projet : ${manifest.name} v${manifest.version}`);
      console.log(`   Méthode : AKORIS ${manifest.akoris}`);
      console.log(`   Registry: v${manifest.registry.version}`);
      console.log(`   Playbook: ${manifest.playbook || 'aucun'}`);
      console.log(`   Type    : ${manifest.projectType || 'non défini'}`);
    } else {
      console.log('⚠️  Aucun MANIFEST.json trouvé');
    }

    const summary = registry.summary();
    console.log(`\n📦 Registry :`);
    console.log(`   ${summary.policies} policies`);
    console.log(`   ${summary.agents} agents`);
    console.log(`   ${summary.contracts} contrats`);
    console.log(`   ${summary.workflows} workflows`);
    console.log(`   ${summary.qualityGates} quality gates`);
    console.log(`   ${summary.metrics} métriques`);
    console.log(`   ${summary.checklists} checklists`);
    console.log(`   ${summary.templates} templates`);
  });
