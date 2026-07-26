import { Command } from 'commander';
import { ValidatorService } from '../services/validator.service.js';
import { RegistryService } from '../services/registry.service.js';
import { success, error, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

const architectureCommand = new Command('architecture')
  .description('Valide l\'architecture (structure des dossiers, ADRs)')
  .action(async () => {
    try {
      const registry = new RegistryService();
      const validator = new ValidatorService(registry);
      info('Validation de l\'architecture...');
      const checks = await validator.validateProjectStructure();
      for (const check of checks) {
        log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        if (!check.passed) log(`   ${check.details}`);
      }
      const { existsSync, readdirSync } = await import('node:fs');
      const { join } = await import('node:path');
      const adrDir = join(process.cwd(), '.akoris', 'decisions');
      const hasAdrs = existsSync(adrDir) && readdirSync(adrDir).length > 0;
      log(`${hasAdrs ? '✅' : '❌'} Décisions d\'architecture (ADRs)`);
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
  .action(() => {
    try {
      const registry = new RegistryService();
      info('Validation du Registry...');
      const summary = registry.summary();
      if (shouldOutputJSON()) {
        printJSON(summary);
        return;
      }
      log(`📦 Policies: ${summary.policies}`);
      log(`🤖 Agents: ${summary.agents}`);
      log(`📝 Contrats: ${summary.contracts}`);
      log(`🔄 Workflows: ${summary.workflows}`);
      log(`✅ Quality Gates: ${summary.qualityGates}`);
      log(`📊 Metrics: ${summary.metrics}`);
      log(`📋 Checklists: ${summary.checklists}`);
      log(`📁 Templates: ${summary.templates}`);
      const total = summary.policies + summary.agents + summary.contracts + summary.workflows;
      if (total > 0) success(`Registry valide (${total} entrées)`);
      else warn('Registry vide');
      if (total === 0) {
        log('   Aucun fichier trouvé dans le Registry');
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
