import { Command } from 'commander';
import { writeFileSync } from 'node:fs';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { StateMachineEngine } from '../services/state-machine.service.js';
import { shouldOutputJSON, printJSON, title, header, info, success, error, warn, log, getOpts } from '../output/format.js';

export const stateCommand = new Command('state')
  .description('Gère la machine à états du projet AKORIS');

stateCommand
  .command('show')
  .description('Affiche l\'état courant du projet')
  .action(() => {
    const reader = new RegistryReaderV2();
    const engine = new StateMachineEngine(reader);
    const machine = engine.getMachine();

    if (!machine) {
      warn('Machine à états non trouvée (state-machine.json manquant)');
      return;
    }

    const currentState = engine.getCurrentState();
    const allStates = engine.getStates();
    const available = engine.getAvailableTransitions(currentState);
    const history = engine.getHistory();

    if (shouldOutputJSON()) {
      printJSON({ currentState, machine, available, history });
      return;
    }

    title('Machine à états AKORIS');
    log(`  État courant : ${currentState}`);
    log(`  Version      : ${machine.version}`);
    log(`  Nom          : ${machine.name}`);

    if (allStates.length > 0) {
      header('États définis');
      for (const s of allStates) {
        const marker = s.id === currentState ? '◀' : ' ';
        log(`  ${marker} ${s.id}${marker === '◀' ? ' (courant)' : ''}`);
        log(`     ${s.description}`);
      }
    }

    if (available.length > 0) {
      header('Transitions possibles');
      for (const t of available) {
        log(`  ${currentState} → ${t.to}`);
        if (t.description) log(`     ${t.description}`);
        log(`     Gates : ${t.gates.length} condition(s) à vérifier`);
        log(`     Autorisation : ${t.authorizedBy}`);
      }
    } else {
      warn('Aucune transition possible depuis l\'état courant');
    }

    if (history.length > 0) {
      header('Historique');
      for (const h of history) {
        const entered = new Date(h.enteredAt).toLocaleString('fr-FR');
        const exited = h.exitedAt ? new Date(h.exitedAt).toLocaleString('fr-FR') : 'en cours';
        log(`  ${h.state} : ${entered} → ${exited}`);
      }
    }
  });

stateCommand
  .command('history')
  .description('Affiche tout l\'historique des transitions')
  .action(() => {
    const reader = new RegistryReaderV2();
    const engine = new StateMachineEngine(reader);
    const history = engine.getHistory();
    const currentState = engine.getCurrentState();

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
      const entered = new Date(h.enteredAt).toLocaleString('fr-FR');
      const exited = h.exitedAt ? new Date(h.exitedAt).toLocaleString('fr-FR') : 'en cours';
      const marker = h.state === currentState ? '◀' : ' ';
      log(`  ${marker} ${h.state}`);
      log(`     Entré : ${entered}`);
      log(`     Sorti : ${exited}`);
    }
  });

stateCommand
  .command('transition')
  .description('Tente une transition d\'état')
  .requiredOption('--from <state>', 'État source')
  .requiredOption('--to <state>', 'État cible')
  .action((options: { from: string; to: string }) => {
    const reader = new RegistryReaderV2();
    const engine = new StateMachineEngine(reader);

    const result = engine.transition(options.from, options.to);

    if (shouldOutputJSON()) {
      printJSON(result);
      return;
    }

    log(`Transition ${options.from} → ${options.to}`);

    if (result.success) {
      success(result.message);
      if (result.gates.length > 0) {
        header('Quality Gates à vérifier');
        for (const gate of result.gates) {
          log(`  ⏳ ${gate}`);
        }
      }
    } else {
      error(result.message);
      process.exitCode = 1;
    }
  });

const exportCmd = new Command('export')
  .description('Exporte l\'état du projet (Markdown, JSON, texte)')
  .option('--format <format>', 'Format : markdown, json, text', 'text')
  .action((options: { format?: string }) => {
    const reader = new RegistryReaderV2();
    const engine = new StateMachineEngine(reader);
    const opts = getOpts();
    const fmt = shouldOutputJSON() ? 'json' : (options.format || 'text') as 'markdown' | 'json' | 'text';
    const report = engine.exportReport(fmt);

    if (opts.output) {
      writeFileSync(opts.output, report, 'utf-8');
      success(`Rapport exporté dans ${opts.output}`);
      return;
    }

    if (fmt === 'json') {
      printJSON(JSON.parse(report));
    } else {
      log(`\n${report}`);
    }
  });

stateCommand.addCommand(exportCmd);

stateCommand
  .command('info')
  .description('Affiche la définition complète de la machine à états')
  .action(() => {
    const reader = new RegistryReaderV2();
    const engine = new StateMachineEngine(reader);
    const machine = engine.getMachine();

    if (!machine) {
      warn('Machine à états non trouvée');
      return;
    }

    if (shouldOutputJSON()) {
      printJSON(machine);
      return;
    }

    title(`Machine : ${machine.name}`);
    log(`Version  : ${machine.version}`);
    log(`Initial  : ${machine.initialState}`);

    header('États');
    for (const s of machine.states) {
      log(`  ${s.id} — ${s.description}`);
    }

    header('Transitions');
    for (const t of machine.transitions) {
      log(`  ${t.from} → ${t.to}`);
      log(`    Gates : ${t.gates.join(', ')}`);
      log(`    Autorisation : ${t.authorizedBy}`);
      if (t.description) log(`    Note : ${t.description}`);
    }
  });
