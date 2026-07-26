import { Command } from 'commander';
import { writeFileSync } from 'node:fs';
import { StateMachineEngine } from '@akoris/core';
import { getProjectRoot } from '../services/project.service.js';
import { shouldOutputJSON, printJSON, title, header, info, success, error, warn, log } from '../output/format.js';

export const stateCommand = new Command('state')
  .description('Gère la machine à états du projet AKORIS');

stateCommand
  .command('show')
  .description('Affiche l\'état courant du projet')
  .action(async () => {
    const projectRoot = getProjectRoot();
    const engine = new StateMachineEngine(projectRoot);

    try {
      const machine = await engine.loadMachine();
      const currentState = await engine.getCurrentState();
      const history = await engine.getHistory();

      if (shouldOutputJSON()) {
        printJSON({ currentState, machine, history });
        return;
      }

      title('Machine à états AKORIS');
      log(`  État courant : ${currentState}`);
      log(`  Version      : ${machine.version}`);

      if (machine.states.length > 0) {
        header('États définis');
        for (const s of machine.states) {
          const marker = s.id === currentState ? '◀' : ' ';
          log(`  ${marker} ${s.id}${marker === '◀' ? ' (courant)' : ''}`);
          log(`     ${s.description}`);
        }
      }

      if (history.length > 0) {
        header('Historique');
        for (const h of history) {
          log(`  ${h.from} → ${h.to} : ${h.at}`);
        }
      }
    } catch (err: any) {
      error(err.message);
      process.exit(1);
    }
  });

stateCommand
  .command('history')
  .description('Affiche tout l\'historique des transitions')
  .action(async () => {
    const projectRoot = getProjectRoot();
    const engine = new StateMachineEngine(projectRoot);
    const history = await engine.getHistory();
    const currentState = await engine.getCurrentState();

    if (history.length === 0) {
      info(`Aucun historique. État actuel : ${currentState}`);
      return;
    }

    if (shouldOutputJSON()) {
      printJSON({ currentState, history });
      return;
    }

    title('Historique des états');
    for (const h of history) {
      log(`  ${h.from} → ${h.to}`);
      log(`     Date : ${h.at}`);
      log(`     Par  : ${h.authorizedBy}`);
    }
  });

stateCommand
  .command('transition')
  .description('Tente une transition d\'état')
  .requiredOption('--from <state>', 'État source')
  .requiredOption('--to <state>', 'État cible')
  .action(async (options: { from: string; to: string }) => {
    const projectRoot = getProjectRoot();
    const engine = new StateMachineEngine(projectRoot);

    try {
      const entry = await engine.transition(options.from, options.to);

      if (shouldOutputJSON()) {
        printJSON(entry);
        return;
      }

      success(`Transition ${options.from} → ${options.to} effectuée`);
    } catch (err: any) {
      error(err.message);
      process.exitCode = 1;
    }
  });

stateCommand
  .command('export')
  .description('Exporte l\'état du projet (Markdown, JSON, texte)')
  .option('--format <format>', 'Format : markdown, json, text', 'text')
  .action(async (options: { format?: string }) => {
    const projectRoot = getProjectRoot();
    const engine = new StateMachineEngine(projectRoot);
    const fmt = (options.format || 'text') as 'markdown' | 'json' | 'text';
    const report = await engine.exportReport(fmt);

    if (shouldOutputJSON() || fmt === 'json') {
      try { printJSON(JSON.parse(report)); } catch { log(report); }
    } else {
      log(`\n${report}`);
    }
  });

stateCommand
  .command('info')
  .description('Affiche la définition complète de la machine à états')
  .action(async () => {
    const projectRoot = getProjectRoot();
    const engine = new StateMachineEngine(projectRoot);

    try {
      const machine = await engine.loadMachine();

      if (shouldOutputJSON()) {
        printJSON(machine);
        return;
      }

      title(`Machine : ${machine.version}`);

      header('États');
      for (const s of machine.states) {
        log(`  ${s.id} — ${s.description}`);
      }

      header('Transitions');
      for (const t of machine.transitions) {
        log(`  ${t.from} → ${t.to}`);
        if (t.description) log(`    ${t.description}`);
      }
    } catch (err: any) {
      error(err.message);
      process.exit(1);
    }
  });
