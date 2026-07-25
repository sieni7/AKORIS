import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { ManifestService } from '../services/manifest.service.js';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const doctorCommand = new Command('doctor')
  .description('Diagnostique l\'état du projet AKORIS')
  .option('--fix', 'Tente de corriger automatiquement les problèmes')
  .action(async (options?: { fix?: boolean }) => {
    try {
      const reader = new RegistryReaderV2();
      const manifestService = new ManifestService();

      console.log('🔍 Diagnostic AKORIS en cours...\n');

      const manifestCheck = manifestService.validate();
      console.log(`${manifestCheck.valid ? '✅' : '❌'} MANIFEST.json`);
      if (manifestCheck.errors.length > 0) {
        for (const err of manifestCheck.errors) console.log(`   ${err}`);
      } else {
        console.log('   MANIFEST.json valide');
      }

      const dirs = ['.akoris', 'docs'];
      for (const dir of dirs) {
        const exists = existsSync(join(process.cwd(), dir));
        console.log(`${exists ? '✅' : '❌'} Dossier ${dir}`);
        if (!exists) console.log(`   ${dir}/ manquant`);
      }

      const index = reader.getIndex();
      const v2ok = reader.validate();
      if (index) {
        console.log(`\n📦 Registry v2 :`);
        console.log(`   Agents     : ${index.components.agents.count}`);
        console.log(`   Policies   : ${index.components.policies.count}`);
        console.log(`   Contrats   : ${index.components.contracts.count}`);
        console.log(`   Workflows  : ${index.components.workflows.count}`);
        console.log(`   QualityGates : ${index.components.qualityGates.count}`);
        console.log(`   Événements : ${index.components.events.count}`);
        console.log(`   Règles     : ${index.components.rules.count}`);
        console.log(`   Livrables  : ${index.components.deliverables.count}`);
      }
      console.log(v2ok.valid ? '\n✅ Registry v2 valide' : '\n⚠️  Registry v2 : problèmes détectés');

      const hasManifest = manifestService.exists();
      if (!hasManifest && options?.fix) {
        manifestService.createDefault('akoris-project', 'app');
        console.log('\n✅ MANIFEST.json créé automatiquement');
      }

      console.log(`\n${v2ok.valid ? '✅' : '⚠️'} Diagnostic terminé`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });
