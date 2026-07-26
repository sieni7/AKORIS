#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { initCommand } from './commands/init.js';
import { setGlobalOptions } from './output/format.js';
import { doctorCommand } from './commands/doctor.js';
import { infoCommand } from './commands/info.js';
import { statusCommand } from './commands/status.js';
import { aboutCommand } from './commands/about.js';
import { registryCommand } from './commands/registry.js';
import { playbookCommand } from './commands/playbook.js';
import { agentCommand } from './commands/agent.js';
import { sprintCommand } from './commands/sprint.js';
import { adrCommand } from './commands/adr.js';
import { auditCommand } from './commands/audit.js';
import { qualityCommand } from './commands/quality.js';
import { docsCommand } from './commands/docs.js';
import { metricsCommand } from './commands/metrics.js';
import { knowledgeCommand } from './commands/knowledge.js';
import { manifestCommand } from './commands/manifest.js';
import { validateCommand } from './commands/validate.js';
import { installCommand } from './commands/install.js';
import { exportCommand } from './commands/export.js';
import { upgradeCommand } from './commands/upgrade.js';
import { stateCommand } from './commands/state.js';
import { activationCommand } from './commands/activation.js';
import { capabilityCommand } from './commands/capability.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
);

const WELCOME = `
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557

      █████╗ ██╗  ██╗ ██████╗ ██████╗ ██╗███████╗
     ██╔══██╗██║ ██╔╝██╔═══██╗██╔══██╗██║██╔════╝
     ███████║█████╔╝ ██║   ██║██████╔╝██║███████╗
     ██╔══██║██╔═██╗ ██║   ██║██╔══██╗██║╚════██║
     ██║  ██║██║  ██╗╚██████╔╝██║  ██║██║███████║
     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝

 Adaptive Knowledge & Orchestrated Review
 for Intelligent Software

 Version       : ${pkg.version}
 CLI           : ${pkg.version}
 Registry      : 1.0.0
 Runtime       : Node.js ${process.version}
 Workspace     : ${process.cwd()}

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

 AKORIS est un systeme de gouvernance pour le developpement logiciel
 assiste par intelligence artificielle.

 Les outils evoluent.
 Les modeles evoluent.
 La gouvernance demeure.

 \u2714 Architecture First
 \u2714 Audit First
 \u2714 Documentation First
 \u2714 Human Validation
 \u2714 Zero Hallucination
 \u2714 Zero Spaghetti Code
 \u2714 Zero Uncontrolled Technical Debt

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

 Commandes principales

   akoris init           Initialiser un projet
   akoris doctor         Diagnostic complet
   akoris status         Etat de sante du projet
   akoris audit sprint   Lancer un audit
   akoris quality check  Verifier les Quality Gates
   akoris registry sync  Synchroniser le Registry
    akoris state          Machine a etats du projet
    akoris activation     Activation des agents
    akoris capability     Recherche de capacites
    akoris --help         Aide complete

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

 "Build software with method, not with chance."

                          - OULAI SIENI
                            Concepteur d'AKORIS

                          sieni7@gmail.com

\u2559\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255c
`;

const program = new Command();

const pkgVersion = pkg.version;

program
  .name('akoris')
  .description('AKORIS - Standard de gouvernance pour le developpement logiciel assiste par IA')
  .version(pkgVersion)
  .helpOption('--help', 'Aide complete')
  .allowExcessArguments(false)
  .option('--json', 'Sortie au format JSON')
  .option('--verbose', 'Affiche les logs détaillés')
  .option('--quiet', 'Réduit la sortie au minimum')
  .option('--no-color', 'Désactive les couleurs')
  .option('--output <file>', 'Exporte le résultat dans un fichier')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts() as { json?: boolean; verbose?: boolean; quiet?: boolean; noColor?: boolean; output?: string };
    setGlobalOptions({
      json: !!opts.json,
      verbose: !!opts.verbose,
      quiet: !!opts.quiet,
      noColor: !!opts.noColor,
      output: opts.output,
    });
    if (opts.noColor) {
      chalk.level = 0;
    }
  });

program.addCommand(initCommand);
program.addCommand(doctorCommand);
program.addCommand(infoCommand);
program.addCommand(statusCommand);
program.addCommand(aboutCommand);
program.addCommand(registryCommand);
program.addCommand(playbookCommand);
program.addCommand(agentCommand);
program.addCommand(sprintCommand);
program.addCommand(adrCommand);
program.addCommand(auditCommand);
program.addCommand(qualityCommand);
program.addCommand(docsCommand);
program.addCommand(metricsCommand);
program.addCommand(knowledgeCommand);
program.addCommand(manifestCommand);
program.addCommand(validateCommand);
program.addCommand(installCommand);
program.addCommand(exportCommand);
program.addCommand(upgradeCommand);
program.addCommand(stateCommand);
program.addCommand(activationCommand);
program.addCommand(capabilityCommand);

if (process.argv.length <= 2) {
  console.log(WELCOME);
  process.exit(0);
}

program.parse(process.argv);

export { program };
