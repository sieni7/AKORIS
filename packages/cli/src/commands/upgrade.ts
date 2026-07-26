import { Command } from 'commander';
import { info, shouldOutputJSON, printJSON } from '../output/format.js';

export const upgradeCommand = new Command('upgrade')
  .description('Upgrade AKORIS CLI to the latest version')
  .action(() => {
    if (shouldOutputJSON()) {
      printJSON({ status: 'not_implemented', message: 'Upgrade checking not yet implemented' });
      return;
    }
    info('Upgrade checking not yet implemented. Will check npm registry in future versions.');
  });
