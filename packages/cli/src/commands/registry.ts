import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
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

registryCommand
  .command('index')
  .description('Affiche l\'index complet du Registry v2')
  .option('--json', 'Sortie au format JSON')
  .action((options: { json?: boolean }) => {
    const reader = new RegistryReaderV2();
    const index = reader.getIndex();

    if (!index) {
      console.log('⚠️  Index du Registry non trouvé (registry.json)');
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(index, null, 2));
      return;
    }

    console.log('Index du Registry AKORIS\n');
    console.log(`  Version : ${index.version}\n`);

    console.log('  Composants :');
    for (const [name, comp] of Object.entries(index.components)) {
      console.log(`    ${name.padEnd(15)} ${comp.count} (${comp.path})`);
    }

    console.log('\n  Domaines :');
    for (const d of index.domains) {
      console.log(`    ${d.id.padEnd(7)} ${d.name.padEnd(30)} ${d.agentCount} agents`);
    }

    const validation = reader.validate();
    if (!validation.valid) {
      console.log('\n  ⚠️  Problèmes détectés :');
      for (const err of validation.errors) {
        console.log(`    ❌ ${err}`);
      }
    } else {
      console.log('\n  ✅ Registry valide');
    }
  });

registryCommand
  .command('watch')
  .description('Surveille les changements dans le Registry')
  .action(() => {
    const reader = new RegistryReaderV2();

    console.log('👀 Surveillance du Registry...');
    console.log('   Appuyez sur Ctrl+C pour arrêter\n');

    const unwatch = reader.watch((changed) => {
      console.log(`\n🔄 Fichier(s) modifié(s) : ${changed.join(', ')}`);
      const validation = reader.validate();
      if (validation.valid) {
        console.log('✅ Registry toujours valide');
      } else {
        console.log('⚠️  Problème(s) détecté(s) :');
        for (const err of validation.errors) {
          console.log(`   ❌ ${err}`);
        }
      }
      console.log('');
    });

    process.on('SIGINT', () => {
      unwatch();
      console.log('\n👋 Surveillance arrêtée');
      process.exit(0);
    });
  });
