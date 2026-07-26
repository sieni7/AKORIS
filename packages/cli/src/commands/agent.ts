import { Command } from 'commander';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RegistryReader } from '@akoris/core';
import type { Agent } from '@akoris/shared';
import { getProjectRoot } from '../services/project.service.js';
import { shouldOutputJSON, printJSON, title, header, info, success, error, warn, log } from '../output/format.js';

export const agentCommand = new Command('agent')
  .description('Gère les agents AKORIS');

agentCommand
  .command('list')
  .description('Liste tous les agents du Registry')
  .action(async () => {
    const projectRoot = getProjectRoot();
    const reader = new RegistryReader(projectRoot);
    const agents = await reader.listAgents();

    if (agents.length === 0) {
      info('Aucun agent trouvé dans le Registry');
      return;
    }

    if (shouldOutputJSON()) {
      printJSON({ agents, count: agents.length });
      return;
    }

    const byDomain = new Map<string, Agent[]>();
    for (const a of agents) {
      const list = byDomain.get(a.domain) || [];
      list.push(a);
      byDomain.set(a.domain, list);
    }

    title(`Agents disponibles (${agents.length})`);
    for (const [domain, domainAgents] of byDomain) {
      header(domain);
      for (const a of domainAgents) {
        const status = a.status !== 'active' ? ` [${a.status}]` : '';
        log(`  ${a.id} — ${a.name}${status}`);
        if (a.capabilities.length > 0) {
          const caps = a.capabilities.map(c => c.name).slice(0, 4);
          log(`    Capacités : ${caps.join(', ')}${a.capabilities.length > 4 ? ` (+${a.capabilities.length - 4})` : ''}`);
        }
      }
    }
  });

agentCommand
  .command('info')
  .description('Affiche les détails d\'un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action(async (id: string) => {
    const projectRoot = getProjectRoot();
    const reader = new RegistryReader(projectRoot);

    try {
      const agent = await reader.loadAgent(id);
      const caps = agent.capabilities.map(c => c.name);

      if (shouldOutputJSON()) {
        printJSON(agent);
        return;
      }

      title(`Agent : ${agent.name}`);
      log(`   ID         : ${agent.id}`);
      log(`   Version    : ${agent.version}`);
      log(`   Domaine    : ${agent.domain}`);
      log(`   Statut     : ${agent.status}`);
      log(`   Criticité  : ${agent.criticity}`);
      if (agent.tags?.length > 0) {
        log(`   Tags       : ${agent.tags.join(', ')}`);
      }
      if (caps.length > 0) {
        log(`\n   Capacités (${caps.length}) :`);
        for (const cap of caps.slice(0, 10)) {
          log(`     - ${cap}`);
        }
        if (caps.length > 10) log(`     ... et ${caps.length - 10} autre(s)`);
      }
    } catch (err: any) {
      error(err.message);
      process.exit(1);
    }
  });

agentCommand
  .command('activate')
  .description('Active un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    info(`Activation de l'agent "${id}"...`);
    info('Fonctionnalité à implémenter dans une version ultérieure');
  });

agentCommand
  .command('deactivate')
  .description('Désactive un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    info(`Désactivation de l'agent "${id}"...`);
    info('Fonctionnalité à implémenter dans une version ultérieure');
  });

agentCommand
  .command('contract')
  .description('Affiche les contrats associés à un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action(async (id: string) => {
    const projectRoot = getProjectRoot();
    const contractsPath = join(projectRoot, 'registry', 'contracts', `${id}.json`);
    try {
      const content = await readFile(contractsPath, 'utf-8');
      const contract = JSON.parse(content);

      if (shouldOutputJSON()) {
        printJSON({ agent: id, contract });
        return;
      }

      log(`Contrat de l'agent "${id}" :`);
      for (const [key, value] of Object.entries(contract)) {
        if (typeof value === 'string') {
          log(`   ${key} : ${value}`);
        } else if (Array.isArray(value)) {
          log(`   ${key} : ${(value as string[]).join(', ')}`);
        }
      }
    } catch {
      info(`Aucun contrat trouvé pour l'agent "${id}"`);
    }
  });

agentCommand
  .command('audit')
  .description('Lance un audit sur le travail d\'un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    info(`Audit de l'agent "${id}"...`);
    info('Fonctionnalité à implémenter dans une version ultérieure');
  });
