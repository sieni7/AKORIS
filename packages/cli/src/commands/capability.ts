import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { CapabilityResolver } from '../services/capability.service.js';

export const capabilityCommand = new Command('capability')
  .description('Recherche et résolution des capacités des agents');

capabilityCommand
  .command('find')
  .description('Trouve les agents possédant une capacité')
  .argument('<capability>', 'Nom de la capacité (ex: design_database)')
  .option('--json', 'Sortie au format JSON')
  .action((capability: string, options: { json?: boolean }) => {
    const reader = new RegistryReaderV2();
    const resolver = new CapabilityResolver(reader);
    const agents = resolver.findAgents(capability);

    if (options.json) {
      console.log(JSON.stringify({ capability, agents }, null, 2));
      return;
    }

    if (agents.length === 0) {
      console.log(`ℹ️  Aucun agent trouvé pour la capacité "${capability}"`);
      const similar = resolver.searchCapabilities(capability);
      if (similar.length > 0) {
        console.log('\nCapacités similaires :');
        for (const s of similar.slice(0, 5)) {
          console.log(`  ${s.capability} → ${s.agents.join(', ')}`);
        }
      }
      return;
    }

    console.log(`Capacité : ${capability}`);
    console.log(`Agents disponibles (${agents.length}) :\n`);
    for (const agent of agents) {
      const caps = resolver.getCapabilities(agent);
      const allCaps = caps.join(', ');
      console.log(`  ${agent}`);
      console.log(`    Capacités : ${allCaps}`);
      console.log();
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

    if (results.length === 0) {
      console.log(`ℹ️  Aucune capacité trouvée pour "${query}"`);
      return;
    }

    console.log(`Recherche : "${query}" — ${results.length} résultat(s)\n`);
    for (const r of results) {
      console.log(`  ${r.capability}`);
      console.log(`    Agents : ${r.agents.join(', ')}`);
      console.log();
    }
  });

capabilityCommand
  .command('team')
  .description('Construit une équipe d\'agents pour une liste de tâches')
  .argument('<tasks...>', 'Liste des tâches (ex: design_api optimize_queries)')
  .option('--json', 'Sortie au format JSON')
  .action((tasks: string[], options: { json?: boolean }) => {
    const reader = new RegistryReaderV2();
    const resolver = new CapabilityResolver(reader);
    const team = resolver.findTeam(tasks);

    if (options.json) {
      const obj: Record<string, string[]> = {};
      for (const [agent, agentTasks] of team) {
        obj[agent] = agentTasks;
      }
      console.log(JSON.stringify({ tasks, team: obj }, null, 2));
      return;
    }

    console.log(`Tâches : ${tasks.join(', ')}`);
    console.log(`Équipe : ${team.size} agent(s)\n`);

    for (const [agent, agentTasks] of team) {
      console.log(`  ${agent}`);
      console.log(`    Tâches : ${agentTasks.join(', ')}`);
      console.log();
    }

    const totalAll = tasks.length;
    const covered = new Set<string>();
    for (const agentTasks of team.values()) {
      for (const t of agentTasks) covered.add(t);
    }

    console.log(`Couverture : ${covered.size}/${totalAll} tâches`);
    if (covered.size < totalAll) {
      const missing = tasks.filter(t => !covered.has(t));
      console.log(`Tâches non couvertes : ${missing.join(', ')}`);
      console.log('Utilisez "akoris capability find <capacité>" pour chercher des agents.');
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
        console.log(`ℹ️  Aucune capacité trouvée pour l'agent "${options.agent}"`);
        return;
      }
      console.log(`Capacités de ${options.agent} :\n`);
      for (const cap of caps) {
        console.log(`  ${cap}`);
      }
      return;
    }

    const allCaps = resolver.getAllCapabilities();
    console.log(`Registre des capacités (${allCaps.length} capacités)\n`);
    for (const cap of allCaps) {
      const agents = resolver.findAgents(cap);
      console.log(`  ${cap} → ${agents.join(', ')}`);
    }
  });