import { Command } from 'commander';
import { SyncService } from '../services/sync.service.js';

export const syncCommand = new Command('sync')
  .description('Synchronise le Registry avec le projet')
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
