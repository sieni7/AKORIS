import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { CapabilityResolver } from '../services/capability.service.js';
import { shouldOutputJSON, printJSON, title, header, info, success, error, warn, log } from '../output/format.js';

interface AgentData {
  id: string;
  name: string;
  version: string;
  domain: string;
  criticity?: string;
  status?: string;
  tags?: string[];
  dependencies?: string[];
  maintainer?: string;
}

export const agentCommand = new Command('agent')
  .description('Gère les agents AKORIS');

function getReader() {
  return new RegistryReaderV2();
}

function getResolver(reader: RegistryReaderV2) {
  return new CapabilityResolver(reader);
}

agentCommand
  .command('list')
  .description('Liste tous les agents du Registry')
  .action(() => {
    const reader = getReader();
    const resolver = getResolver(reader);
    const dirs = reader.listAgentDirs();

    if (dirs.length === 0) {
      info('Aucun agent trouvé dans le Registry');
      return;
    }

    const agents: AgentData[] = [];
    for (const dir of dirs) {
      const data = reader.readAgentJson<AgentData>(dir);
      if (data) agents.push(data);
    }

    if (shouldOutputJSON()) {
      const byDomain: Record<string, AgentData[]> = {};
      for (const a of agents) {
        const list = byDomain[a.domain] || [];
        list.push(a);
        byDomain[a.domain] = list;
      }
      for (const a of agents) {
        (a as any).capabilities = resolver.getCapabilities(a.id);
      }
      printJSON({ agents, byDomain });
      return;
    }

    const byDomain = new Map<string, AgentData[]>();
    for (const a of agents) {
      const list = byDomain.get(a.domain) || [];
      list.push(a);
      byDomain.set(a.domain, list);
    }

    title(`Agents disponibles (${agents.length})`);
    for (const [domain, domainAgents] of byDomain) {
      header(domain);
      for (const a of domainAgents) {
        const caps = resolver.getCapabilities(a.id);
        if (a.status && a.status !== 'active') {
          log(`  ${a.id} — ${a.name} [${a.status}]`);
        } else {
          log(`  ${a.id} — ${a.name}`);
        }
        if (caps.length > 0) {
          log(`    Capacités : ${caps.slice(0, 4).join(', ')}${caps.length > 4 ? ` (+${caps.length - 4})` : ''}`);
        }
      }
    }
  });

agentCommand
  .command('info')
  .description('Affiche les détails d\'un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    const reader = getReader();
    const resolver = getResolver(reader);
    const dir = reader.findAgentDir(id);
    if (!dir) {
      error(`Agent "${id}" introuvable`);
      process.exit(1);
    }

    const data = reader.readAgentJson<AgentData>(dir);
    if (!data) {
      error(`Agent "${id}" introuvable`);
      process.exit(1);
    }

    const caps = resolver.getCapabilities(id);
    const contractData = reader.getAgentContract(id);
    const contracts = contractData ? Object.keys(contractData).slice(0, 5) : [];

    if (shouldOutputJSON()) {
      printJSON({ ...data, capabilities: caps, contracts: contractData || {} });
      return;
    }

    title(`Agent : ${data.name}`);
    log(`   ID         : ${data.id}`);
    log(`   Version    : ${data.version}`);
    log(`   Domaine    : ${data.domain}`);
    log(`   Statut     : ${data.status || 'non défini'}`);
    log(`   Criticité  : ${data.criticity || 'non définie'}`);
    if (data.tags && data.tags.length > 0) {
      log(`   Tags       : ${data.tags.join(', ')}`);
    }
    if (data.dependencies && data.dependencies.length > 0) {
      log(`   Dépend de  : ${data.dependencies.join(', ')}`);
    }
    if (data.maintainer) {
      log(`   Maintainer : ${data.maintainer}`);
    }
    if (caps.length > 0) {
      log(`\n   Capacités (${caps.length}) :`);
      for (const cap of caps.slice(0, 10)) {
        log(`     - ${cap}`);
      }
      if (caps.length > 10) log(`     ... et ${caps.length - 10} autre(s)`);
    }
    if (contracts.length > 0) {
      log(`\n   Contrats : ${contracts.join(', ')}`);
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
  .action((id: string) => {
    const reader = getReader();
    const contract = reader.getAgentContract(id);

    if (!contract) {
      info(`Aucun contrat trouvé pour l'agent "${id}"`);
      return;
    }

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
  });

agentCommand
  .command('audit')
  .description('Lance un audit sur le travail d\'un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    info(`Audit de l'agent "${id}"...`);
    info('Fonctionnalité à implémenter dans une version ultérieure');
  });
