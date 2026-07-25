import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { ActivationEngine } from '../services/activation.service.js';
import { CapabilityResolver } from '../services/capability.service.js';

export const activationCommand = new Command('activation')
  .description('Gère l\'activation des agents par événement');

activationCommand
  .command('suggest')
  .description('Suggère les agents à activer pour un événement')
  .requiredOption('-e, --event <eventId>', 'Identifiant de l\'événement (ex: SPRINT_START)')
  .action((options: { event: string }) => {
    const reader = new RegistryReaderV2();
    const engine = new ActivationEngine(reader);
    const resolver = new CapabilityResolver(reader);
    const agents = engine.getAgentsForEvent(options.event);

    if (agents.length === 0) {
      console.log(`ℹ️  Aucun agent trouvé pour l'événement "${options.event}"`);
      console.log('   Utilisez "akoris activation list" pour voir les événements disponibles.');
      return;
    }

    const phase = engine.getPhase(options.event);
    const frequency = engine.getFrequency(options.event);

    console.log(`Événement : ${options.event}`);
    if (phase) console.log(`Phase      : ${phase}`);
    if (frequency) console.log(`Fréquence  : ${frequency}`);
    console.log(`\nAgents à activer (${agents.length}) :\n`);

    for (const agent of agents) {
      const caps = resolver.getCapabilities(agent);
      const topCap = caps.slice(0, 3).join(', ');

      console.log(`  ${agent}`);
      if (topCap) console.log(`    Capacités : ${topCap}`);
      console.log();
    }
  });

activationCommand
  .command('list')
  .description('Liste tous les événements et leurs agents')
  .option('-p, --phase <phase>', 'Filtrer par phase')
  .action((options: { phase?: string }) => {
    const reader = new RegistryReaderV2();
    const engine = new ActivationEngine(reader);
    const events = engine.getAllEvents();

    if (events.length === 0) {
      console.log('⚠️  Aucun événement trouvé dans la matrice d\'activation');
      return;
    }

    const filtered = options.phase
      ? events.filter(e => e.phase === options.phase)
      : events;

    const byPhase = new Map<string, typeof filtered>();
    for (const ev of filtered) {
      const list = byPhase.get(ev.phase) || [];
      list.push(ev);
      byPhase.set(ev.phase, list);
    }

    console.log(`Matrice d'activation (${filtered.length} événements)`);
    if (options.phase) console.log(`Filtre : phase "${options.phase}"`);
    console.log();

    for (const [phase, phaseEvents] of byPhase) {
      console.log(`Phase : ${phase}`);
      for (const ev of phaseEvents) {
        console.log(`  ${ev.id}`);
        console.log(`    ${ev.description}`);
        console.log(`    Agents (${ev.agents.length}) : ${ev.agents.join(', ')}`);
        console.log(`    Fréquence : ${ev.frequency}`);
        console.log();
      }
    }
  });

activationCommand
  .command('events')
  .description('Liste les événements auxquels un agent participe')
  .requiredOption('-a, --agent <agentId>', 'Identifiant de l\'agent')
  .action((options: { agent: string }) => {
    const reader = new RegistryReaderV2();
    const engine = new ActivationEngine(reader);
    const events = engine.getEventsForAgent(options.agent);

    if (events.length === 0) {
      console.log(`ℹ️  L'agent "${options.agent}" n'est activé par aucun événement`);
      return;
    }

    console.log(`Agent : ${options.agent}`);
    console.log(`Activé par ${events.length} événement(s) :\n`);
    for (const ev of events) {
      console.log(`  ${ev.event}`);
      console.log(`    ${ev.description}`);
      console.log(`    Phase : ${ev.phase} | Fréquence : ${ev.frequency}`);
      console.log();
    }
  });