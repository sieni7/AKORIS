import { Command } from 'commander';
import { RegistryReader } from '@akoris/core';
import { ValidatorService } from '../services/validator.service.js';
import { getProjectRoot } from '../services/project.service.js';
import { success, error, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

const architectureCommand = new Command('architecture')
  .description('Valide l\'architecture (structure des dossiers, ADRs)')
  .action(async () => {
    try {
      const projectRoot = getProjectRoot();
      const validator = new ValidatorService(projectRoot);
      info('Validation de l\'architecture...');
      const checks = await validator.validateProjectStructure();
      for (const check of checks) {
        log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        if (!check.passed) log(`   ${check.details}`);
      }
      const { existsSync, readdirSync } = await import('node:fs');
      const { join } = await import('node:path');
      const adrDir = join(projectRoot, '.akoris', 'decisions');
      const hasAdrs = existsSync(adrDir) && readdirSync(adrDir).length > 0;
      log(`${hasAdrs ? '✅' : '❌'} Décisions d'architecture (ADRs)`);
      if (!hasAdrs) log('   Aucune décision dans .akoris/decisions/');
      const allPassed = checks.every(c => c.passed) && hasAdrs;
      if (shouldOutputJSON()) {
        printJSON({ checks, hasAdrs, valid: allPassed });
        return;
      }
      if (allPassed) success('Validation terminée');
      else warn('Validation terminée avec des avertissements');
      if (!allPassed) process.exitCode = 1;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

const documentationCommand = new Command('documentation')
  .description('Valide que la documentation existe et est complète')
  .action(async () => {
    try {
      const { existsSync, readdirSync } = await import('node:fs');
      const { join } = await import('node:path');
      info('Vérification de la documentation...');
      const requiredDirs = ['docs/architecture', 'docs/guides', 'docs/api'];
      let allPassed = true;
      for (const dir of requiredDirs) {
        const fullPath = join(process.cwd(), dir);
        const exists = existsSync(fullPath);
        const hasContent = exists && readdirSync(fullPath).length > 0;
        log(`${hasContent ? '✅' : '❌'} ${dir}/`);
        if (!hasContent) {
          log(`   ${exists ? 'Dossier vide' : 'Dossier manquant'}`);
          allPassed = false;
        }
      }
      const readmePath = join(process.cwd(), 'README.md');
      const hasReadme = existsSync(readmePath);
      log(`${hasReadme ? '✅' : '❌'} README.md`);
      if (!hasReadme) allPassed = false;
      if (shouldOutputJSON()) {
        printJSON({ allPassed, hasReadme });
        return;
      }
      if (allPassed) success('Validation de la documentation terminée');
      else warn('Validation de la documentation terminée avec des avertissements');
      if (!allPassed) process.exitCode = 1;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

const securityCommand = new Command('security')
  .description('Valide les politiques de sécurité (placeholder)')
  .action(() => {
    info('Validation de sécurité...');
    if (shouldOutputJSON()) {
      printJSON({ status: 'placeholder', message: 'Fonctionnalité à implémenter dans une version ultérieure' });
      return;
    }
    warn('Fonctionnalité à implémenter dans une version ultérieure');
    log('   Vérifications prévues :');
    log('   - Politiques de sécurité appliquées');
    log('   - Dépendances sécurisées');
    log('   - Variables d\'environnement protégées');
  });

const registrySubCommand = new Command('registry')
  .description('Valide les schémas et fichiers du Registry')
  .action(async () => {
    try {
      const projectRoot = getProjectRoot();
      const reader = new RegistryReader(projectRoot);
      const index = await reader.loadIndex();
      const validation = await reader.validate();

      if (shouldOutputJSON()) {
        printJSON({ validation, index });
        return;
      }

      info('Validation du Registry...');
      if (index.components) {
        for (const [name, comp] of Object.entries(index.components)) {
          log(`   ${name.padEnd(15)} ${(comp as any).count}`);
        }
      }

      if (validation.valid) {
        success('Registry valide');
      } else {
        warn('Problèmes détectés');
        for (const err of validation.errors) {
          error(`  ${err.type}: ${err.message}`);
        }
        process.exitCode = 1;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

export const validateCommand = new Command('validate')
  .description('Valide différents aspects du projet AKORIS')
  .addCommand(architectureCommand)
  .addCommand(documentationCommand)
  .addCommand(securityCommand)
  .addCommand(registrySubCommand);
