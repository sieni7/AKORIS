import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';
import { SyncService } from '../services/sync.service.js';
import { ValidatorService } from '../services/validator.service.js';

export const registryCommand = new Command('registry')
  .description('Gère le Registry AKORIS');

registryCommand
  .command('list')
  .description('Liste tous les composants du Registry')
  .action(() => {
    const registry = new RegistryService();
    const summary = registry.summary();

    console.log('📦 Registry AKORIS\n');
    console.log(`   ${summary.policies} policies`);
    console.log(`   ${summary.agents} agents`);
    console.log(`   ${summary.contracts} contrats`);
    console.log(`   ${summary.workflows} workflows`);
    console.log(`   ${summary.qualityGates} quality gates`);
    console.log(`   ${summary.metrics} métriques`);
    console.log(`   ${summary.checklists} checklists`);
    console.log(`   ${summary.templates} templates`);
  });

registryCommand
  .command('info')
  .description('Affiche les informations d\'un domaine du Registry')
  .argument('<domain>', 'Domaine (agents, policies, contracts, workflows)')
  .action((domain: string) => {
    const registry = new RegistryService();
    const validDomains = ['agents', 'policies', 'contracts', 'workflows'];

    if (!validDomains.includes(domain)) {
      console.error(`❌ Domaine invalide. Utilisez l'un des suivants : ${validDomains.join(', ')}`);
      process.exit(1);
    }

    const items = registry[`get${domain.charAt(0).toUpperCase() + domain.slice(1)}` as keyof RegistryService] as () => any[];

    if (typeof items !== 'function') {
      console.error(`❌ Impossible de lire le domaine "${domain}"`);
      process.exit(1);
    }

    const data = items.call(registry);

    if (!data || data.length === 0) {
      console.log(`ℹ️  Aucun élément trouvé dans le domaine "${domain}"`);
      return;
    }

    console.log(`📂 Domaine : ${domain} (${data.length} élément(s))\n`);
    for (const item of data) {
      console.log(`   • ${item.name || item.id || 'Sans nom'}`);
      if (item.version) console.log(`     Version : ${item.version}`);
      if (item.description) console.log(`     ${item.description}`);
      console.log();
    }
  });

registryCommand
  .command('update')
  .description('Met à jour le Registry depuis le dépôt distant')
  .action(() => {
    console.log('🔄 Mise à jour du Registry...');
    console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
  });

registryCommand
  .command('sync')
  .description('Synchronise le Registry vers le dossier .akoris/')
  .option('-r, --registry <path>', 'Chemin du Registry', 'registry')
  .action((options?: { registry?: string }) => {
    const registryPath = options?.registry || 'registry';
    const syncService = new SyncService(registryPath);

    console.log('🔄 Synchronisation du Registry...\n');

    const result = syncService.syncRegistry();
    console.log(`✅ ${result.updated} fichiers synchronisés`);
    if (result.skipped > 0) {
      console.log(`⚠️  ${result.skipped} fichiers ignorés`);
    }
    console.log('📁 Destination : .akoris/');
  });

registryCommand
  .command('validate')
  .description('Valide les schémas du Registry')
  .action(async () => {
    try {
      const registry = new RegistryService();
      const validator = new ValidatorService(registry);

      console.log('🔍 Validation du Registry...\n');

      const checks = [
        await validator.validateManifest(),
        ...await validator.validateProjectStructure(),
      ];

      for (const check of checks) {
        console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        if (check.details) console.log(`   ${check.details}`);
      }

      const passed = checks.filter(c => c.passed).length;
      const failed = checks.filter(c => !c.passed).length;

      console.log(`\n📊 ${passed}/${checks.length} validations passées`);
      if (failed === 0) {
        console.log('✅ Registry valide');
      } else {
        console.log('⚠️  Des erreurs ont été détectées');
        process.exitCode = 1;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });
