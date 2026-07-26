import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { ManifestService } from '../services/manifest.service.js';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { shouldOutputJSON, printJSON, title, success, error, warn, log } from '../output/format.js';

export const doctorCommand = new Command('doctor')
  .description('Diagnostique l\'état du projet AKORIS')
  .option('--fix', 'Tente de corriger automatiquement les problèmes')
  .action(async (options?: { fix?: boolean }) => {
    try {
      const reader = new RegistryReaderV2();
      const manifestService = new ManifestService();

      log('🔍 Diagnostic AKORIS en cours...\n');

      const manifestCheck = manifestService.validate();
      const results: Record<string, any> = {};

      results.manifest = { valid: manifestCheck.valid, errors: manifestCheck.errors };
      log(`${manifestCheck.valid ? '✅' : '❌'} MANIFEST.json`);
      if (manifestCheck.errors.length > 0) {
        for (const err of manifestCheck.errors) log(`   ${err}`);
      } else {
        log('   MANIFEST.json valide');
      }

      const dirs = ['.akoris', 'docs'];
      results.dirs = {};
      for (const dir of dirs) {
        const exists = existsSync(join(process.cwd(), dir));
        results.dirs[dir] = exists;
        log(`${exists ? '✅' : '❌'} Dossier ${dir}`);
        if (!exists) log(`   ${dir}/ manquant`);
      }

      const index = reader.getIndex();
      const v2ok = reader.validate();
      results.registry = { index, valid: v2ok.valid, errors: v2ok.errors };
      if (index) {
        log(`\n📦 Registry v2 :`);
        log(`   Agents     : ${index.components.agents.count}`);
        log(`   Policies   : ${index.components.policies.count}`);
        log(`   Contrats   : ${index.components.contracts.count}`);
        log(`   Workflows  : ${index.components.workflows.count}`);
        log(`   QualityGates : ${index.components.qualityGates.count}`);
        log(`   Événements : ${index.components.events.count}`);
        log(`   Règles     : ${index.components.rules.count}`);
        log(`   Livrables  : ${index.components.deliverables.count}`);
      }
      log(v2ok.valid ? '\n✅ Registry v2 valide' : '\n⚠️  Registry v2 : problèmes détectés');

      const hasManifest = manifestService.exists();
      if (!hasManifest && options?.fix) {
        manifestService.createDefault('akoris-project', 'app');
        success('MANIFEST.json créé automatiquement');
        results.manifestFix = true;
      }

      if (shouldOutputJSON()) {
        printJSON(results);
        return;
      }

      log(`\n${v2ok.valid ? '✅' : '⚠️'} Diagnostic terminé`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });
