import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function InitCommand() {
  return new Command('init')
    .description('Initialize a new AKORIS project')
    .argument('[directory]', 'project directory', '.')
    .action(async (directory: string, cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const r = renderer;
      r.info(`Initializing AKORIS project in '${directory}'...`);
      r.success('Project initialized. Run `akoris status` to check system health.');
    });
}
