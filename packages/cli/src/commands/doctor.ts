import { Command } from 'commander';
import { RegistryReader, DoctorEngine } from '@akoris/core';
import { ManifestService } from '../services/manifest.service.js';
import { getProjectRoot } from '../services/project.service.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { shouldOutputJSON, printJSON, title, success, error, warn, info, log } from '../output/format.js';

export const doctorCommand = new Command('doctor')
  .description('Diagnostique et répare l\'état du projet AKORIS')
  .option('--fix', 'Tente de corriger automatiquement les problèmes')
  .action(async (options?: { fix?: boolean }) => {
    const projectRoot = getProjectRoot();
    const issues: string[] = [];
    const fixes: string[] = [];
    const results: Record<string, any> = {};

    const doctor = new DoctorEngine(projectRoot);
    const manifestService = new ManifestService(projectRoot);

    log('Diagnostic AKORIS en cours...\n');

    // 1. Dossier .akoris/
    const akorisPath = join(projectRoot, '.akoris');
    const hasAkoris = existsSync(akorisPath);
    results.akoris = { exists: hasAkoris };
    log(`${hasAkoris ? '✅' : '❌'} Dossier .akoris/`);
    if (!hasAkoris) {
      issues.push('Dossier .akoris/ manquant');
      if (options?.fix) {
        const result = await doctor.fix();
        fixes.push(...result.fixes);
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
        const result = await doctor.fix();
        fixes.push(...result.fixes.filter(f => f.includes('state')));
        results.state.fixed = true;
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
        await doctor.fix();
        fixes.push('Dossier logs/sessions/ créé');
        results.logs.fixed = true;
      }
    }

    // 6. Registry
    try {
      const reader = new RegistryReader(projectRoot);
      const index = await reader.loadIndex();
      log(`\nRegistry v${index.version} :`);
      log(`   Agents : ${index.components?.agents?.count || 0}`);
      if (index.components) {
        for (const [name, comp] of Object.entries(index.components)) {
          log(`   ${name} : ${(comp as any).count}`);
        }
      }
      const validation = await reader.validate();
      log(validation.valid ? '✅ Registry valide' : '❌ Registry : problèmes détectés');
      if (!validation.valid) {
        issues.push(`Registry : ${validation.errors.length} erreur(s)`);
      }
    } catch {
      issues.push('Registry injoignable');
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

    if (options?.fix && fixes.length > 0) {
      success(`${fixes.length} correction(s) appliquée(s) :`);
      for (const fix of fixes) {
        log(`  - ${fix}`);
      }
    } else if (!options?.fix) {
      info('\n💡 Pour corriger automatiquement :  akoris doctor --fix');
    }
  });
