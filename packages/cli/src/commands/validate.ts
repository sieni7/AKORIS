import { Command } from 'commander';
import { ValidatorService } from '../services/validator.service.js';
import { RegistryService } from '../services/registry.service.js';

const architectureCommand = new Command('architecture')
  .description('Valide l\'architecture (structure des dossiers, ADRs)')
  .action(async () => {
    try {
      const registry = new RegistryService();
      const validator = new ValidatorService(registry);
      console.log('🔍 Validation de l\'architecture...\n');
      const checks = await validator.validateProjectStructure();
      for (const check of checks) {
        console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        if (!check.passed) console.log(`   ${check.details}`);
      }
      const { existsSync, readdirSync } = await import('node:fs');
      const { join } = await import('node:path');
      const adrDir = join(process.cwd(), '.akoris', 'decisions');
      const hasAdrs = existsSync(adrDir) && readdirSync(adrDir).length > 0;
      console.log(`${hasAdrs ? '✅' : '❌'} Décisions d\'architecture (ADRs)`);
      if (!hasAdrs) console.log('   Aucune décision dans .akoris/decisions/');
      const allPassed = checks.every(c => c.passed) && hasAdrs;
      console.log(`\n${allPassed ? '✅' : '⚠️'} Validation terminée`);
      if (!allPassed) process.exitCode = 1;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });

const documentationCommand = new Command('documentation')
  .description('Valide que la documentation existe et est complète')
  .action(async () => {
    try {
      const { existsSync, readdirSync } = await import('node:fs');
      const { join } = await import('node:path');
      console.log('🔍 Vérification de la documentation...\n');
      const requiredDirs = ['docs/architecture', 'docs/guides', 'docs/api'];
      let allPassed = true;
      for (const dir of requiredDirs) {
        const fullPath = join(process.cwd(), dir);
        const exists = existsSync(fullPath);
        const hasContent = exists && readdirSync(fullPath).length > 0;
        console.log(`${hasContent ? '✅' : '❌'} ${dir}/`);
        if (!hasContent) {
          console.log(`   ${exists ? 'Dossier vide' : 'Dossier manquant'}`);
          allPassed = false;
        }
      }
      const readmePath = join(process.cwd(), 'README.md');
      const hasReadme = existsSync(readmePath);
      console.log(`${hasReadme ? '✅' : '❌'} README.md`);
      if (!hasReadme) allPassed = false;
      console.log(`\n${allPassed ? '✅' : '⚠️'} Validation de la documentation terminée`);
      if (!allPassed) process.exitCode = 1;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });

const securityCommand = new Command('security')
  .description('Valide les politiques de sécurité (placeholder)')
  .action(() => {
    console.log('🔒 Validation de sécurité...\n');
    console.log('⚠️  Fonctionnalité à implémenter dans une version ultérieure');
    console.log('   Vérifications prévues :');
    console.log('   - Politiques de sécurité appliquées');
    console.log('   - Dépendances sécurisées');
    console.log('   - Variables d\'environnement protégées');
  });

const registryCommand = new Command('registry')
  .description('Valide les schémas et fichiers du Registry')
  .action(() => {
    try {
      const registry = new RegistryService();
      console.log('🔍 Validation du Registry...\n');
      const summary = registry.summary();
      console.log(`📦 Policies: ${summary.policies}`);
      console.log(`🤖 Agents: ${summary.agents}`);
      console.log(`📝 Contrats: ${summary.contracts}`);
      console.log(`🔄 Workflows: ${summary.workflows}`);
      console.log(`✅ Quality Gates: ${summary.qualityGates}`);
      console.log(`📊 Metrics: ${summary.metrics}`);
      console.log(`📋 Checklists: ${summary.checklists}`);
      console.log(`📁 Templates: ${summary.templates}`);
      const total = summary.policies + summary.agents + summary.contracts + summary.workflows;
      console.log(`\n${total > 0 ? '✅' : '⚠️'} Registry valide (${total} entrées)`);
      if (total === 0) {
        console.log('   Aucun fichier trouvé dans le Registry');
        process.exitCode = 1;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });

export const validateCommand = new Command('validate')
  .description('Valide différents aspects du projet AKORIS')
  .addCommand(architectureCommand)
  .addCommand(documentationCommand)
  .addCommand(securityCommand)
  .addCommand(registryCommand);
