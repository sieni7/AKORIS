import { Command } from 'commander';
import { ManifestService } from '../services/manifest.service.js';
import { success, error, warn, shouldOutputJSON, printJSON, log } from '../output/format.js';

const showCommand = new Command('show')
  .description('Affiche le contenu du MANIFEST.json')
  .action(() => {
    try {
      const manifestService = new ManifestService();
      if (!manifestService.exists()) {
        error('MANIFEST.json introuvable');
        process.exit(1);
      }
      if (shouldOutputJSON()) {
        printJSON(manifestService.read());
        return;
      }
      log(JSON.stringify(manifestService.read(), null, 2));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

const updateCommand = new Command('update')
  .description('Met à jour les champs du MANIFEST.json')
  .option('-n, --name <name>', 'Nom du projet')
  .option('-v, --version <version>', 'Version du projet')
  .option('-d, --description <description>', 'Description du projet')
  .option('-p, --playbook <playbook>', 'Playbook actif')
  .option('-t, --project-type <type>', 'Type de projet (app, saas, api, lib)')
  .action((options?: { name?: string; version?: string; description?: string; playbook?: string; projectType?: string }) => {
    try {
      const manifestService = new ManifestService();
      if (!manifestService.exists()) {
        error('MANIFEST.json introuvable');
        process.exit(1);
      }
      const manifest = manifestService.read();
      if (options?.name) manifest.name = options.name;
      if (options?.version) manifest.version = options.version;
      if (options?.description) manifest.description = options.description;
      if (options?.playbook) manifest.playbook = options.playbook;
      if (options?.projectType) manifest.projectType = options.projectType;
      manifestService.write(manifest);
      if (shouldOutputJSON()) {
        printJSON({ updated: true, manifest });
        return;
      }
      success('MANIFEST.json mis à jour');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

const validateSubCommand = new Command('validate')
  .description('Valide la structure du MANIFEST.json')
  .action(() => {
    try {
      const manifestService = new ManifestService();
      const { valid, errors } = manifestService.validate();
      if (shouldOutputJSON()) {
        printJSON({ valid, errors });
        return;
      }
      if (valid) {
        success('MANIFEST.json valide');
      } else {
        error('MANIFEST.json invalide :');
        for (const err of errors) {
          log(`   - ${err}`);
        }
        process.exitCode = 1;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

export const manifestCommand = new Command('manifest')
  .description('Gère le MANIFEST.json du projet')
  .addCommand(showCommand)
  .addCommand(updateCommand)
  .addCommand(validateSubCommand);
