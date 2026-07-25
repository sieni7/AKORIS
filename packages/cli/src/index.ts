#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { installCommand } from './commands/install.js';
import { doctorCommand } from './commands/doctor.js';
import { auditCommand } from './commands/audit.js';
import { qualityCommand } from './commands/quality.js';
import { statusCommand } from './commands/status.js';
import { syncCommand } from './commands/sync.js';
import { metricsCommand } from './commands/metrics.js';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
);

const program = new Command();

program
  .name('akoris')
  .description('AKORIS - Standard de gouvernance pour le développement logiciel assisté par IA')
  .version(pkg.version);

program.addCommand(initCommand);
program.addCommand(installCommand);
program.addCommand(doctorCommand);
program.addCommand(auditCommand);
program.addCommand(qualityCommand);
program.addCommand(statusCommand);
program.addCommand(syncCommand);
program.addCommand(metricsCommand);

program.parse(process.argv);
