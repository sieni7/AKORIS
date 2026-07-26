import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { ManifestService } from '../services/manifest.service.js';
import { StateMachineEngine } from '../services/state-machine.service.js';
import { ensureProjectDirectories } from '../services/project.service.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { shouldOutputJSON, printJSON, title, success, error, warn, info, log, isVerbose } from '../output/format.js';

export const doctorCommand = new Command('doctor')
  .description('Diagnostique et répare l\'état du projet AKORIS')
  .option('--fix', 'Tente de corriger automatiquement les problèmes')
  .action(async (options?: { fix?: boolean }) => {
    const projectRoot = process.cwd();
    const issues: string[] = [];
    const fixes: string[] = [];
    const results: Record<string, any> = {};

    const reader = new RegistryReaderV2();
    const manifestService = new ManifestService(projectRoot);
    const stateEngine = new StateMachineEngine(reader, projectRoot);

    log('🔍 Diagnostic AKORIS en cours...\n');

    // 1. Dossier .akoris/
    const akorisPath = join(projectRoot, '.akoris');
    const hasAkoris = existsSync(akorisPath);
    results.akoris = { exists: hasAkoris };
    log(`${hasAkoris ? '✅' : '❌'} Dossier .akoris/`);
    if (!hasAkoris) {
      issues.push('Dossier .akoris/ manquant');
      if (options?.fix) {
        const created = ensureProjectDirectories(projectRoot);
        fixes.push(`.akoris/ créé (${created.length} sous-dossiers)`);
        results.akoris.created = created;
      }
    }

    // 2. MANIFEST.json
    const manifestCheck = manifestService.validate();
    results.manifest = { valid: manifestCheck.valid, errors: manifestCheck.errors };
    log(`${manifestCheck.valid ? '✅' : '❌'} MANIFEST.json`);
    if (manifestCheck.errors.length > 0) {
      for (const err of manifestCheck.errors) log(`   ${err}`);
      issues.push('MANIFEST.json invalide ou manquant');
      if (options?.fix && !manifestService.exists()) {
        const manifest = manifestService.createDefault('akoris-project', 'app');
        manifestService.write(manifest);
        fixes.push('MANIFEST.json créé avec les valeurs par défaut');
        results.manifest.fixed = true;
      }
    } else {
      log('   MANIFEST.json valide');
    }

    // 3. docs/
    const hasDocs = existsSync(join(projectRoot, 'docs'));
    results.docs = { exists: hasDocs };
    log(`${hasDocs ? '✅' : '❌'} Dossier docs/`);
    if (!hasDocs) {
      issues.push('Dossier docs/ manquant');
    }

    // 4. state.json
    const statePath = join(akorisPath, 'state.json');
    const hasState = existsSync(statePath);
    results.state = { exists: hasState };
    log(`${hasState ? '✅' : '❌'} .akoris/state.json`);
    if (!hasState) {
      issues.push('Fichier state.json manquant');
      if (options?.fix) {
        stateEngine.ensureStateFile();
        fixes.push('state.json créé avec l\'état Draft');
        results.state.fixed = true;
      }
    } else {
      try {
        stateEngine.getCurrentState();
      } catch {
        issues.push('state.json corrompu');
        if (options?.fix) {
          stateEngine.ensureStateFile();
          fixes.push('state.json régénéré avec l\'état Draft');
          results.state.fixed = true;
        }
      }
    }

    // 5. logs/sessions/
    const logsPath = join(akorisPath, 'logs', 'sessions');
    const hasLogs = existsSync(logsPath);
    results.logs = { exists: hasLogs };
    log(`${hasLogs ? '✅' : '❌'} .akoris/logs/sessions/`);
    if (!hasLogs) {
      issues.push('Dossier logs/sessions/ manquant');
      if (options?.fix) {
        ensureProjectDirectories(projectRoot);
        fixes.push('Dossier logs/sessions/ créé');
        results.logs.fixed = true;
      }
    }

    // 6. Registry v2
    const v2ok = reader.validate();
    results.registry = { valid: v2ok.valid, errors: v2ok.errors };
    if (reader.getIndex()) {
      const index = reader.getIndex()!;
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
    log(v2ok.valid ? '✅ Registry v2 valide' : '❌ Registry v2 : problèmes détectés');
    if (!v2ok.valid) {
      issues.push(`Registry v2 : ${v2ok.errors.length} erreur(s)`);
      if (options?.fix) {
        fixes.push('⚠️ Le Registry ne peut pas être réparé automatiquement. Vérifiez registry/registry.json');
      }
    }

    if (shouldOutputJSON()) {
      results.status = issues.length === 0 ? 'healthy' : 'unhealthy';
      results.issues = issues;
      results.fixes = options?.fix ? fixes : [];
      results.fixApplied = !!options?.fix;
      printJSON(results);
      return;
    }

    if (issues.length === 0) {
      success('Aucun problème détecté. Le projet est sain.');
      return;
    }

    warn(`${issues.length} problème(s) détecté(s) :`);
    for (const issue of issues) {
      log(`  - ${issue}`);
    }

    if (options?.fix) {
      if (fixes.length > 0) {
        success(`${fixes.length} correction(s) appliquée(s) :`);
        for (const fix of fixes) {
          log(`  - ${fix}`);
        }
      } else {
        warn('Aucune correction automatique disponible pour les problèmes restants.');
      }
    } else {
      info('\n💡 Pour corriger automatiquement :  akoris doctor --fix');
    }
  });
