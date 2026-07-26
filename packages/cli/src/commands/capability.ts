import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RegistryReader } from '@akoris/core';
import { getProjectRoot } from '../services/project.service.js';
import { shouldOutputJSON, printJSON, title, header, info, warn, log } from '../output/format.js';

export const capabilityCommand = new Command('capability')
  .description('Recherche et résolution des capacités des agents');

async function loadCapabilityRegistry(projectRoot: string): Promise<Record<string, string[]>> {
  const path = join(projectRoot, 'registry', 'capabilities.json');
  try {
    const content = await readFile(path, 'utf-8');
    const data = JSON.parse(content);
    return data.capabilities || data || {};
  } catch {
    return {};
  }
}

capabilityCommand
  .command('find')
  .description('Trouve les agents possédant une capacité')
  .argument('<capability>', 'Nom de la capacité (ex: design_database)')
  .action(async (capability: string) => {
    const projectRoot = getProjectRoot();
    const caps = await loadCapabilityRegistry(projectRoot);
    const agents = caps[capability] || [];
    const similar = Object.entries(caps)
      .filter(([key]) => key.includes(capability) || capability.includes(key))
      .slice(0, 5);

    if (shouldOutputJSON()) {
      printJSON({ capability, agents, similar: similar.map(([k, v]) => ({ [k]: v })) });
      return;
    }

    if (agents.length === 0) {
      info(`Aucun agent trouvé pour la capacité "${capability}"`);
      if (similar.length > 0) {
        header('Capacités similaires');
        for (const [name, agentList] of similar) {
          log(`  ${name} → ${agentList.join(', ')}`);
        }
      }
      return;
    }

    log(`Capacité : ${capability}`);
    log(`Agents disponibles (${agents.length}) :`);
    for (const agent of agents) {
      log(`  ${agent}`);
    }
  });

capabilityCommand
  .command('search')
  .description('Recherche des capacités par mot-clé')
  .argument('<query>', 'Mot-clé de recherche')
  .action(async (query: string) => {
    const projectRoot = getProjectRoot();
    const caps = await loadCapabilityRegistry(projectRoot);
    const results = Object.entries(caps)
      .filter(([key]) => key.toLowerCase().includes(query.toLowerCase()))
      .map(([capability, agentList]) => ({ capability, agents: agentList }));

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
  .action(async (tasks: string[]) => {
    const projectRoot = getProjectRoot();
    const caps = await loadCapabilityRegistry(projectRoot);
    const team = new Map<string, string[]>();

    for (const task of tasks) {
      const agents = caps[task] || [];
      for (const agent of agents) {
        const existing = team.get(agent) || [];
        existing.push(task);
        team.set(agent, existing);
      }
    }

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

    const covered = new Set(team.values().reduce((acc, t) => [...acc, ...t], [] as string[]));
    log(`Couverture : ${covered.size}/${tasks.length} tâches`);
    if (covered.size < tasks.length) {
      const missing = tasks.filter(t => !covered.has(t));
      warn(`Tâches non couvertes : ${missing.join(', ')}`);
      log('Utilisez "akoris capability find <capacité>" pour chercher des agents.');
    }
  });

capabilityCommand
  .command('list')
  .description('Liste toutes les capacités disponibles')
  .option('-a, --agent <agentId>', 'Filtrer par agent')
  .action(async (options: { agent?: string }) => {
    const projectRoot = getProjectRoot();
    const caps = await loadCapabilityRegistry(projectRoot);

    if (options.agent) {
      const agentCaps = Object.entries(caps)
        .filter(([, agents]) => agents.includes(options.agent!))
        .map(([cap]) => cap);

      if (agentCaps.length === 0) {
        info(`Aucune capacité trouvée pour l'agent "${options.agent}"`);
        return;
      }
      if (shouldOutputJSON()) {
        printJSON({ agent: options.agent, capabilities: agentCaps });
        return;
      }
      header(`Capacités de ${options.agent}`);
      for (const cap of agentCaps) {
        log(`  ${cap}`);
      }
      return;
    }

    if (shouldOutputJSON()) {
      printJSON({ capabilities: caps });
      return;
    }

    header(`Registre des capacités (${Object.keys(caps).length} capacités)`);
    for (const [cap, agents] of Object.entries(caps)) {
      log(`  ${cap} → ${agents.join(', ')}`);
    }
  });
