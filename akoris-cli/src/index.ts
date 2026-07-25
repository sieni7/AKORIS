#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { doctorCommand } from "./commands/doctor.js";
import { statusCommand } from "./commands/status.js";
import { auditCommand } from "./commands/audit.js";
import { qualityCommand } from "./commands/quality.js";
import { installCommand } from "./commands/install.js";
import { registryCommand } from "./commands/registry.js";
import { playbookCommand } from "./commands/playbook.js";
import { validateCommand } from "./commands/validate.js";
import { metricsCommand } from "./commands/metrics.js";
import { knowledgeCommand } from "./commands/knowledge.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf-8")
);

const program = new Command();

program
  .name("akoris")
  .description(chalk.cyan("AKORIS — Moteur de gouvernance pour le développement logiciel assisté par IA"))
  .version(pkg.version);

program.addCommand(initCommand);
program.addCommand(doctorCommand);
program.addCommand(statusCommand);
program.addCommand(auditCommand);
program.addCommand(qualityCommand);
program.addCommand(installCommand);
program.addCommand(registryCommand);
program.addCommand(playbookCommand);
program.addCommand(validateCommand);
program.addCommand(metricsCommand);
program.addCommand(knowledgeCommand);
program.addCommand(upgradeCommand);

program.parse(process.argv);
