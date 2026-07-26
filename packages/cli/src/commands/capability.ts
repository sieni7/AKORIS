import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { CapabilityResolver } from '../services/capability.service.js';
import { shouldOutputJSON, printJSON, title, header, info, warn, log } from '../output/format.js';

export const capabilityCommand = new Command('capability')
  .description('Recherche et résolution des capacités des agents');

capabilityCommand
  .command('find')
  .description('Trouve les agents possédant une capacité')
  .argument('<capability>', 'Nom de la capacité (ex: design_database)')
  .action((capability: string) => {
    const reader = new RegistryReaderV2();
    const resolver = new CapabilityResolver(reader);
    const agents = resolver.findAgents(capability);

    if (shouldOutputJSON()) {
      printJSON({ capability, agents });
      return;
    }

    if (agents.length === 0) {
      info(`Aucun agent trouvé pour la capacité "${capability}"`);
      const similar = resolver.searchCapabilities(capability);
      if (similar.length > 0) {
        header('Capacités similaires');
        for (const s of similar.slice(0, 5)) {
          log(`  ${s.capability} → ${s.agents.join(', ')}`);
        }
      }
      return;
    }

    log(`Capacité : ${capability}`);
    log(`Agents disponibles (${agents.length}) :`);
    for (const agent of agents) {
      const caps = resolver.getCapabilities(agent);
      const allCaps = caps.join(', ');
      log(`  ${agent}`);
      log(`    Capacités : ${allCaps}`);
    }
  });

capabilityCommand
  .command('search')
  .description('Recherche des capacités par mot-clé')
  .argument('<query>', 'Mot-clé de recherche')
  .action((query: string) => {
    const reader = new RegistryReaderV2();
    const resolver = new CapabilityResolver(reader);
    const results = resolver.searchCapabilities(query);

    if (shouldOutputJSON()) {
      printJSON({ query, results });
      return;
    }

    if (results.length === 0) {
      info(`Aucune capacité trouvée pour "${query}"`);
      return;
    }

    log(`Recherche : "${query}" — ${results.length} résultat(s)`);
    for (const r of results) {
      log(`  ${r.capability}`);
      log(`    Agents : ${r.agents.join(', ')}`);
    }
  });

capabilityCommand
  .command('team')
  .description('Construit une équipe d\'agents pour une liste de tâches')
  .argument('<tasks...>', 'Liste des tâches (ex: design_api optimize_queries)')
  .action((tasks: string[]) => {
    const reader = new RegistryReaderV2();
    const resolver = new CapabilityResolver(reader);
    const team = resolver.findTeam(tasks);

    if (shouldOutputJSON()) {
      const obj: Record<string, string[]> = {};
      for (const [agent, agentTasks] of team) {
        obj[agent] = agentTasks;
      }
      printJSON({ tasks, team: obj });
      return;
    }

    log(`Tâches : ${tasks.join(', ')}`);
    log(`Équipe : ${team.size} agent(s)`);

    for (const [agent, agentTasks] of team) {
      log(`  ${agent}`);
      log(`    Tâches : ${agentTasks.join(', ')}`);
    }

    const totalAll = tasks.length;
    const covered = new Set<string>();
    for (const agentTasks of team.values()) {
      for (const t of agentTasks) covered.add(t);
    }

    log(`Couverture : ${covered.size}/${totalAll} tâches`);
    if (covered.size < totalAll) {
      const missing = tasks.filter(t => !covered.has(t));
      warn(`Tâches non couvertes : ${missing.join(', ')}`);
      log('Utilisez "akoris capability find <capacité>" pour chercher des agents.');
    }
  });

capabilityCommand
  .command('list')
  .description('Liste toutes les capacités disponibles')
  .option('-a, --agent <agentId>', 'Filtrer par agent')
  .action((options: { agent?: string }) => {
    const reader = new RegistryReaderV2();
    const resolver = new CapabilityResolver(reader);

    if (options.agent) {
      const caps = resolver.getCapabilities(options.agent);
      if (caps.length === 0) {
        info(`Aucune capacité trouvée pour l'agent "${options.agent}"`);
        return;
      }
      if (shouldOutputJSON()) {
        printJSON({ agent: options.agent, capabilities: caps });
        return;
      }
      header(`Capacités de ${options.agent}`);
      for (const cap of caps) {
        log(`  ${cap}`);
      }
      return;
    }

    const allCaps = resolver.getAllCapabilities();
    if (shouldOutputJSON()) {
      const obj: Record<string, string[]> = {};
      for (const cap of allCaps) {
        obj[cap] = resolver.findAgents(cap);
      }
      printJSON({ capabilities: obj });
      return;
    }

    header(`Registre des capacités (${allCaps.length} capacités)`);
    for (const cap of allCaps) {
      const agents = resolver.findAgents(cap);
      log(`  ${cap} → ${agents.join(', ')}`);
    }
  });
