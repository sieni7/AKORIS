import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { ActivationEngine } from '../services/activation.service.js';
import { CapabilityResolver } from '../services/capability.service.js';
import { shouldOutputJSON, printJSON, title, header, info, success, error, warn, log } from '../output/format.js';

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
      info(`Aucun agent trouvé pour l'événement "${options.event}"`);
      log('   Utilisez "akoris activation list" pour voir les événements disponibles.');
      return;
    }

    const phase = engine.getPhase(options.event);
    const frequency = engine.getFrequency(options.event);

    if (shouldOutputJSON()) {
      printJSON({ event: options.event, phase, frequency, agents });
      return;
    }

    log(`Événement : ${options.event}`);
    if (phase) log(`Phase      : ${phase}`);
    if (frequency) log(`Fréquence  : ${frequency}`);
    header(`Agents à activer (${agents.length})`);

    for (const agent of agents) {
      const caps = resolver.getCapabilities(agent);
      const topCap = caps.slice(0, 3).join(', ');
      log(`  ${agent}`);
      if (topCap) log(`    Capacités : ${topCap}`);
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
      warn('Aucun événement trouvé dans la matrice d\'activation');
      return;
    }

    const filtered = options.phase
      ? events.filter(e => e.phase === options.phase)
      : events;

    if (shouldOutputJSON()) {
      printJSON({ events: filtered, filter: options.phase || null });
      return;
    }

    title(`Matrice d'activation (${filtered.length} événements)`);
    if (options.phase) log(`Filtre : phase "${options.phase}"`);

    const byPhase = new Map<string, typeof filtered>();
    for (const ev of filtered) {
      const list = byPhase.get(ev.phase) || [];
      list.push(ev);
      byPhase.set(ev.phase, list);
    }

    for (const [phase, phaseEvents] of byPhase) {
      header(`Phase : ${phase}`);
      for (const ev of phaseEvents) {
        log(`  ${ev.id}`);
        log(`    ${ev.description}`);
        log(`    Agents (${ev.agents.length}) : ${ev.agents.join(', ')}`);
        log(`    Fréquence : ${ev.frequency}`);
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
      info(`L'agent "${options.agent}" n'est activé par aucun événement`);
      return;
    }

    if (shouldOutputJSON()) {
      printJSON({ agent: options.agent, events });
      return;
    }

    log(`Agent : ${options.agent}`);
    log(`Activé par ${events.length} événement(s) :`);
    for (const ev of events) {
      log(`  ${ev.event}`);
      log(`    ${ev.description}`);
      log(`    Phase : ${ev.phase} | Fréquence : ${ev.frequency}`);
    }
  });
