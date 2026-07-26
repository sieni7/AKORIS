import { Command } from 'commander';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { getProjectRoot } from '../services/project.service.js';
import { shouldOutputJSON, printJSON, title, header, info, warn, log } from '../output/format.js';

export const activationCommand = new Command('activation')
  .description('Gère l\'activation des agents par événement');

interface ActivationEvent {
  id: string;
  description: string;
  agents: string[];
  frequency: string;
  phase: string;
}

async function loadActivationMatrix(projectRoot: string): Promise<Record<string, ActivationEvent>> {
  const path = join(projectRoot, 'registry', 'activation-matrix.json');
  try {
    const content = await readFile(path, 'utf-8');
    const data = JSON.parse(content);
    return data.events || data || {};
  } catch {
    return {};
  }
}

activationCommand
  .command('suggest')
  .description('Suggère les agents à activer pour un événement')
  .requiredOption('-e, --event <eventId>', 'Identifiant de l\'événement (ex: SPRINT_START)')
  .action(async (options: { event: string }) => {
    const projectRoot = getProjectRoot();
    const events = await loadActivationMatrix(projectRoot);
    const ev = events[options.event];

    if (!ev) {
      info(`Aucun agent trouvé pour l'événement "${options.event}"`);
      info('Utilisez "akoris activation list" pour voir les événements disponibles.');
      return;
    }

    if (shouldOutputJSON()) {
      printJSON({ event: options.event, phase: ev.phase, frequency: ev.frequency, agents: ev.agents });
      return;
    }

    log(`Événement : ${options.event}`);
    log(`Phase      : ${ev.phase}`);
    log(`Fréquence  : ${ev.frequency}`);
    header(`Agents à activer (${ev.agents.length})`);
    for (const agent of ev.agents) {
      log(`  ${agent}`);
    }
  });

activationCommand
  .command('list')
  .description('Liste tous les événements et leurs agents')
  .option('-p, --phase <phase>', 'Filtrer par phase')
  .action(async (options: { phase?: string }) => {
    const projectRoot = getProjectRoot();
    const events = await loadActivationMatrix(projectRoot);
    const allEvents = Object.entries(events).map(([id, ev]) => ({ id, ...ev }));

    if (allEvents.length === 0) {
      warn('Aucun événement trouvé dans la matrice d\'activation');
      return;
    }

    const filtered = options.phase
      ? allEvents.filter(e => e.phase === options.phase)
      : allEvents;

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
  .action(async (options: { agent: string }) => {
    const projectRoot = getProjectRoot();
    const events = await loadActivationMatrix(projectRoot);
    const agentEvents = Object.entries(events)
      .filter(([, ev]) => ev.agents.includes(options.agent))
      .map(([id, ev]) => ({ event: id, ...ev }));

    if (agentEvents.length === 0) {
      info(`L'agent "${options.agent}" n'est activé par aucun événement`);
      return;
    }

    if (shouldOutputJSON()) {
      printJSON({ agent: options.agent, events: agentEvents });
      return;
    }

    log(`Agent : ${options.agent}`);
    log(`Activé par ${agentEvents.length} événement(s) :`);
    for (const ev of agentEvents) {
      log(`  ${ev.event}`);
      log(`    ${ev.description}`);
      log(`    Phase : ${ev.phase} | Fréquence : ${ev.frequency}`);
    }
  });
