import { Command } from 'commander';
import { createCoreService } from '../services/core-factory.js';
import { createRenderer } from '../output/renderer.js';
import { StatusCommand } from '../commands/status/index.js';
import { DoctorCommand } from '../commands/doctor/index.js';
import { RegistryCommand } from '../commands/registry/index.js';
import { StateCommand } from '../commands/state/index.js';
import { LogsCommand } from '../commands/logs/index.js';
import { GatesCommand } from '../commands/gates/index.js';
import { SecretsCommand } from '../commands/secrets/index.js';
import { AliasesCommand } from '../commands/aliases/index.js';
import { PromptsCommand } from '../commands/prompts/index.js';
import { InitCommand } from '../commands/init/index.js';

export function createProgram() {
  const program = new Command();

  program
    .name('akoris')
    .description('AKORIS — governance system for AI-assisted development')
    .version('1.0.0')
    .option('--json', 'output in JSON format')
    .option('--no-color', 'disable colors')
    .hook('preAction', (_thisCmd, actionCmd) => {
      const opts = actionCmd.optsWithGlobals();
      const renderer = createRenderer({ format: opts.json ? 'json' : undefined });
      const core = createCoreService();
      (actionCmd as any).__renderer = renderer;
      (actionCmd as any).__core = core;
    });

  program.addCommand(StatusCommand());
  program.addCommand(DoctorCommand());
  program.addCommand(RegistryCommand());
  program.addCommand(StateCommand());
  program.addCommand(LogsCommand());
  program.addCommand(GatesCommand());
  program.addCommand(SecretsCommand());
  program.addCommand(AliasesCommand());
  program.addCommand(PromptsCommand());
  program.addCommand(InitCommand());

  return program;
}
