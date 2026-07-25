import { Command } from 'commander';

export const upgradeCommand = new Command('upgrade')
  .description('Upgrade AKORIS CLI to the latest version')
  .action(() => {
    console.log('Upgrade checking not yet implemented. Will check npm registry in future versions.');
  });
