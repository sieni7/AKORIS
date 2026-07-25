import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';
import { ValidatorService } from '../services/validator.service.js';
import { ManifestService } from '../services/manifest.service.js';

export const doctorCommand = new Command('doctor')
  .description('Diagnostique l\'état du projet AKORIS')
  .option('--fix', 'Tente de corriger automatiquement les problèmes')
  .action(async (options?: { fix?: boolean }) => {
    try {
      const registry = new RegistryService();
      const validator = new ValidatorService(registry);
      const manifestService = new ManifestService();

      console.log('🔍 Diagnostic AKORIS en cours...\n');

      const manifestCheck = await validator.validateManifest();
      console.log(`${manifestCheck.passed ? '✅' : '❌'} ${manifestCheck.name}`);
      if (manifestCheck.details) console.log(`   ${manifestCheck.details}`);

      const structureChecks = await validator.validateProjectStructure();
      for (const check of structureChecks) {
        console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        if (!check.passed) console.log(`   ${check.details}`);
      }

      const registrySummary = registry.summary();
      console.log(`\n📦 Registry :`);
      console.log(`   Policies: ${registrySummary.policies}`);
      console.log(`   Agents: ${registrySummary.agents}`);
      console.log(`   Contrats: ${registrySummary.contracts}`);
      console.log(`   Workflows: ${registrySummary.workflows}`);
      console.log(`   Quality Gates: ${registrySummary.qualityGates}`);

      const hasManifest = manifestService.exists();
      if (!hasManifest && options?.fix) {
        manifestService.createDefault('akoris-project', 'app');
        console.log('\n✅ MANIFEST.json créé automatiquement');
      }

      const allPassed = manifestCheck.passed && structureChecks.every(c => c.passed);
      console.log(`\n${allPassed ? '✅' : '⚠️'} Diagnostic terminé`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });
