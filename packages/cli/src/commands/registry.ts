import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { SyncService } from '../services/sync.service.js';
import { ValidatorService } from '../services/validator.service.js';
import { shouldOutputJSON, printJSON, title, header, info, success, error, warn, log } from '../output/format.js';

export const registryCommand = new Command('registry')
  .description('Gère le Registry AKORIS');

registryCommand
  .command('list')
  .description('Liste tous les composants du Registry')
  .action(() => {
    const registry = new RegistryService();
    const summary = registry.summary();

    if (shouldOutputJSON()) {
      printJSON(summary);
      return;
    }

    log('📦 Registry AKORIS\n');
    log(`   ${summary.policies} policies`);
    log(`   ${summary.agents} agents`);
    log(`   ${summary.contracts} contrats`);
    log(`   ${summary.workflows} workflows`);
    log(`   ${summary.qualityGates} quality gates`);
    log(`   ${summary.metrics} métriques`);
    log(`   ${summary.checklists} checklists`);
    log(`   ${summary.templates} templates`);
  });

registryCommand
  .command('info')
  .description('Affiche les informations d\'un domaine du Registry')
  .argument('<domain>', 'Domaine (agents, policies, contracts, workflows)')
  .action((domain: string) => {
    const registry = new RegistryService();
    const validDomains = ['agents', 'policies', 'contracts', 'workflows'];

    if (!validDomains.includes(domain)) {
      error(`Domaine invalide. Utilisez l'un des suivants : ${validDomains.join(', ')}`);
      process.exit(1);
    }

    const items = registry[`get${domain.charAt(0).toUpperCase() + domain.slice(1)}` as keyof RegistryService] as () => any[];

    if (typeof items !== 'function') {
      error(`Impossible de lire le domaine "${domain}"`);
      process.exit(1);
    }

    const data = items.call(registry);

    if (!data || data.length === 0) {
      info(`Aucun élément trouvé dans le domaine "${domain}"`);
      return;
    }

    if (shouldOutputJSON()) {
      printJSON({ domain, items: data });
      return;
    }

    log(`📂 Domaine : ${domain} (${data.length} élément(s))\n`);
    for (const item of data) {
      log(`   • ${item.name || item.id || 'Sans nom'}`);
      if (item.version) log(`     Version : ${item.version}`);
      if (item.description) log(`     ${item.description}`);
    }
  });

registryCommand
  .command('update')
  .description('Met à jour le Registry depuis le dépôt distant')
  .action(() => {
    info('Mise à jour du Registry...');
    info('Fonctionnalité à implémenter dans une version ultérieure');
  });

registryCommand
  .command('sync')
  .description('Synchronise le Registry vers le dossier .akoris/')
  .option('-r, --registry <path>', 'Chemin du Registry', 'registry')
  .action((options?: { registry?: string }) => {
    const registryPath = options?.registry || 'registry';
    const syncService = new SyncService(registryPath);

    log('🔄 Synchronisation du Registry...\n');

    const result = syncService.syncRegistry();

    if (shouldOutputJSON()) {
      printJSON(result);
      return;
    }

    success(`${result.updated} fichiers synchronisés`);
    if (result.skipped > 0) {
      warn(`${result.skipped} fichiers ignorés`);
    }
    log('📁 Destination : .akoris/');
  });

registryCommand
  .command('validate')
  .description('Valide les schémas du Registry')
  .action(() => {
    try {
      const reader = new RegistryReaderV2();

      log('🔍 Validation du Registry v2...\n');

      const validation = reader.validate();

      const index = reader.getIndex();

      if (shouldOutputJSON()) {
        printJSON({ validation, index });
        return;
      }

      if (index) {
        log(`Version : ${index.version}\n`);
        log('Composants :');
        for (const [name, comp] of Object.entries(index.components)) {
          const ok = comp.count > 0;
          log(`  ${ok ? '✅' : '❌'} ${name.padEnd(15)} ${comp.count} (${comp.path})`);
        }
      }

      if (validation.valid) {
        success('Registry v2 valide');
      } else {
        warn('Problèmes détectés :');
        for (const err of validation.errors) {
          error(err);
        }
        process.exitCode = 1;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

registryCommand
  .command('index')
  .description('Affiche l\'index complet du Registry v2')
  .action(() => {
    const reader = new RegistryReaderV2();
    const index = reader.getIndex();

    if (!index) {
      warn('Index du Registry non trouvé (registry.json)');
      return;
    }

    if (shouldOutputJSON()) {
      printJSON(index);
      return;
    }

    log('Index du Registry AKORIS\n');
    log(`  Version : ${index.version}\n`);

    log('  Composants :');
    for (const [name, comp] of Object.entries(index.components)) {
      log(`    ${name.padEnd(15)} ${comp.count} (${comp.path})`);
    }

    log('\n  Domaines :');
    for (const d of index.domains) {
      log(`    ${d.id.padEnd(7)} ${d.name.padEnd(30)} ${d.agentCount} agents`);
    }

    const validation = reader.validate();
    if (!validation.valid) {
      warn('Problèmes détectés :');
      for (const err of validation.errors) {
        error(err);
      }
    } else {
      success('Registry valide');
    }
  });

registryCommand
  .command('watch')
  .description('Surveille les changements dans le Registry')
  .action(() => {
    const reader = new RegistryReaderV2();

    info('Surveillance du Registry...');
    info('Appuyez sur Ctrl+C pour arrêter\n');

    const unwatch = reader.watch((changed) => {
      log(`\n🔄 Fichier(s) modifié(s) : ${changed.join(', ')}`);
      const validation = reader.validate();
      if (validation.valid) {
        success('Registry toujours valide');
      } else {
        warn('Problème(s) détecté(s) :');
        for (const err of validation.errors) {
          error(err);
        }
      }
    });

    process.on('SIGINT', () => {
      unwatch();
      info('Surveillance arrêtée');
      process.exit(0);
    });
  });
