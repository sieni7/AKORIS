import { Command } from 'commander';
import { RegistryReader } from '@akoris/core';
import { getProjectRoot } from '../services/project.service.js';
import { shouldOutputJSON, printJSON, title, header, info, success, error, warn, log } from '../output/format.js';

export const registryCommand = new Command('registry')
  .description('Gère le Registry AKORIS');

registryCommand
  .command('list')
  .description('Liste tous les composants du Registry')
  .action(async () => {
    const projectRoot = getProjectRoot();
    try {
      const reader = new RegistryReader(projectRoot);
      const index = await reader.loadIndex();

      if (shouldOutputJSON()) {
        printJSON(index);
        return;
      }

      log('Registry AKORIS\n');
      if (index.components) {
        for (const [name, comp] of Object.entries(index.components)) {
          log(`   ${name.padEnd(15)} ${(comp as any).count} (${(comp as any).path})`);
        }
      }
    } catch (err: any) {
      error(`Erreur : ${err.message}`);
      process.exit(1);
    }
  });

registryCommand
  .command('index')
  .description('Affiche l\'index complet du Registry v2')
  .action(async () => {
    const projectRoot = getProjectRoot();
    try {
      const reader = new RegistryReader(projectRoot);
      const index = await reader.loadIndex();

      if (shouldOutputJSON()) {
        printJSON(index);
        return;
      }

      log('Index du Registry AKORIS\n');
      log(`  Version : ${index.version}\n`);

      if (index.components) {
        log('  Composants :');
        for (const [name, comp] of Object.entries(index.components)) {
          log(`    ${name.padEnd(15)} ${(comp as any).count} (${(comp as any).path})`);
        }
      }

      if (index.domains) {
        log('\n  Domaines :');
        for (const d of index.domains) {
          log(`    ${d.id.padEnd(7)} ${d.name.padEnd(30)} ${d.agentCount} agents`);
        }
      }

      success('Registry chargé');
    } catch (err: any) {
      error(`Erreur : ${err.message}`);
      process.exit(1);
    }
  });

registryCommand
  .command('validate')
  .description('Valide les schémas du Registry')
  .action(async () => {
    const projectRoot = getProjectRoot();
    try {
      const reader = new RegistryReader(projectRoot);
      log('Validation du Registry...\n');

      const validation = await reader.validate();

      if (shouldOutputJSON()) {
        printJSON(validation);
        return;
      }

      if (validation.valid) {
        success('Registry valide');
      } else {
        warn('Problèmes détectés :');
        for (const err of validation.errors) {
          error(`  ${err.type} : ${err.message}`);
        }
        process.exitCode = 1;
      }
    } catch (err: any) {
      error(`Erreur : ${err.message}`);
      process.exit(1);
    }
  });

registryCommand
  .command('watch')
  .description('Surveille les changements dans le Registry')
  .action(() => {
    const projectRoot = getProjectRoot();
    const reader = new RegistryReader(projectRoot);

    info('Surveillance du Registry... (Ctrl+C pour arrêter)\n');

    const unwatch = reader.watch((event) => {
      log(`\nModification détectée : ${event.path}`);
      log('Utilisez "akoris registry validate" pour vérifier l\'intégrité.');
    });

    process.on('SIGINT', () => {
      unwatch();
      info('Surveillance arrêtée');
      process.exit(0);
    });
  });

registryCommand
  .command('info')
  .description('Affiche les informations d\'un domaine du Registry')
  .argument('<domain>', 'Domaine (agents, policies, contracts, workflows)')
  .action(async (domain: string) => {
    const projectRoot = getProjectRoot();
    try {
      const reader = new RegistryReader(projectRoot);
      const index = await reader.loadIndex();

      if (shouldOutputJSON()) {
        printJSON({ domain, index });
        return;
      }

      log(`Domaine : ${domain}`);
      log(`Version : ${index.version}`);
    } catch (err: any) {
      error(`Erreur : ${err.message}`);
      process.exit(1);
    }
  });
