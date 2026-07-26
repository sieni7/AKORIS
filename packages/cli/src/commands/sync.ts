import { Command } from 'commander';
import { SyncService } from '../services/sync.service.js';
import { success, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

export const syncCommand = new Command('sync')
  .description('Synchronise le Registry avec le projet')
  .option('-r, --registry <path>', 'Chemin du Registry', 'registry')
  .action((options?: { registry?: string }) => {
    const registryPath = options?.registry || 'registry';
    const syncService = new SyncService(registryPath);

    if (shouldOutputJSON()) {
      const result = syncService.syncRegistry();
      printJSON(result);
      return;
    }

    info('Synchronisation du Registry...');

    const result = syncService.syncRegistry();
    success(`${result.updated} fichiers synchronisés`);
    if (result.skipped > 0) {
      warn(`${result.skipped} fichiers ignorés`);
    }
    log('📁 Destination : .akoris/');
  });
