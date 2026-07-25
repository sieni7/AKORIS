import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { StateMachineEngine } from '../services/state-machine.service.js';

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
      console.log('⚠️  Machine à états non trouvée (state-machine.json manquant)');
      return;
    }

    const currentState = engine.getCurrentState();
    const allStates = engine.getStates();
    const available = engine.getAvailableTransitions(currentState);
    const history = engine.getHistory();

    console.log('Machine à états AKORIS\n');
    console.log(`  État courant : ${currentState}`);
    console.log(`  Version      : ${machine.version}`);
    console.log(`  Nom          : ${machine.name}\n`);

    if (allStates.length > 0) {
      console.log('États définis :');
      for (const s of allStates) {
        const marker = s.id === currentState ? '◀' : ' ';
        console.log(`  ${marker} ${s.id}${marker === '◀' ? ' (courant)' : ''}`);
        console.log(`     ${s.description}`);
      }
      console.log();
    }

    if (available.length > 0) {
      console.log('Transitions possibles :');
      for (const t of available) {
        console.log(`  ${currentState} → ${t.to}`);
        if (t.description) console.log(`     ${t.description}`);
        console.log(`     Gates : ${t.gates.length} condition(s) à vérifier`);
        console.log(`     Autorisation : ${t.authorizedBy}`);
      }
    } else {
      console.log('⚠️  Aucune transition possible depuis l\'état courant');
    }

    if (history.length > 0) {
      console.log('\nHistorique :');
      for (const h of history) {
        const entered = new Date(h.enteredAt).toLocaleString('fr-FR');
        const exited = h.exitedAt ? new Date(h.exitedAt).toLocaleString('fr-FR') : 'en cours';
        console.log(`  ${h.state} : ${entered} → ${exited}`);
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
      console.log('ℹ️  Aucun historique. État actuel : ' + currentState);
      return;
    }

    console.log('Historique des états\n');
    for (const h of history) {
      const entered = new Date(h.enteredAt).toLocaleString('fr-FR');
      const exited = h.exitedAt ? new Date(h.exitedAt).toLocaleString('fr-FR') : 'en cours';
      const marker = h.state === currentState ? '◀' : ' ';
      console.log(`  ${marker} ${h.state}`);
      console.log(`     Entré : ${entered}`);
      console.log(`     Sorti : ${exited}`);
      console.log();
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

    console.log(`Transition ${options.from} → ${options.to}\n`);

    const result = engine.transition(options.from, options.to);

    if (result.success) {
      console.log(`  ✅ ${result.message}`);
      if (result.gates.length > 0) {
        console.log(`\n  Quality Gates à vérifier :`);
        for (const gate of result.gates) {
          console.log(`    ⏳ ${gate}`);
        }
      }
    } else {
      console.log(`  ❌ ${result.message}`);
      process.exitCode = 1;
    }
  });

stateCommand
  .command('info')
  .description('Affiche la définition complète de la machine à états')
  .action(() => {
    const reader = new RegistryReaderV2();
    const engine = new StateMachineEngine(reader);
    const machine = engine.getMachine();

    if (!machine) {
      console.log('⚠️  Machine à états non trouvée');
      return;
    }

    console.log(`Machine : ${machine.name}`);
    console.log(`Version  : ${machine.version}`);
    console.log(`Initial  : ${machine.initialState}\n`);

    console.log('États :');
    for (const s of machine.states) {
      console.log(`  ${s.id} — ${s.description}`);
    }

    console.log('\nTransitions :');
    for (const t of machine.transitions) {
      console.log(`  ${t.from} → ${t.to}`);
      console.log(`    Gates : ${t.gates.join(', ')}`);
      console.log(`    Autorisation : ${t.authorizedBy}`);
      if (t.description) console.log(`    Note : ${t.description}`);
      console.log();
    }
  });