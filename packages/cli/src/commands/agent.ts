import { Command } from 'commander';
import { RegistryReaderV2 } from '../services/registry-reader-v2.service.js';
import { CapabilityResolver } from '../services/capability.service.js';

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
      console.log('ℹ️  Aucun agent trouvé dans le Registry');
      return;
    }

    const agents: AgentData[] = [];
    for (const dir of dirs) {
      const data = reader.readAgentJson<AgentData>(dir);
      if (data) agents.push(data);
    }

    const byDomain = new Map<string, AgentData[]>();
    for (const a of agents) {
      const list = byDomain.get(a.domain) || [];
      list.push(a);
      byDomain.set(a.domain, list);
    }

    console.log(`🤖 Agents disponibles (${agents.length}) :\n`);
    for (const [domain, domainAgents] of byDomain) {
      console.log(`  ${domain} :`);
      for (const a of domainAgents) {
        const caps = resolver.getCapabilities(a.id);
        if (a.status && a.status !== 'active') {
          console.log(`    ${a.id} — ${a.name} [${a.status}]`);
        } else {
          console.log(`    ${a.id} — ${a.name}`);
        }
        if (caps.length > 0) {
          console.log(`      Capacités : ${caps.slice(0, 4).join(', ')}${caps.length > 4 ? ` (+${caps.length - 4})` : ''}`);
        }
      }
      console.log();
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
      console.error(`❌ Agent "${id}" introuvable`);
      process.exit(1);
    }

    const data = reader.readAgentJson<AgentData>(dir);
    if (!data) {
      console.error(`❌ Agent "${id}" introuvable`);
      process.exit(1);
    }

    const caps = resolver.getCapabilities(id);
    const contractData = reader.getAgentContract(id);
    const contracts = contractData ? Object.keys(contractData).slice(0, 5) : [];

    console.log(`🤖 Agent : ${data.name}\n`);
    console.log(`   ID         : ${data.id}`);
    console.log(`   Version    : ${data.version}`);
    console.log(`   Domaine    : ${data.domain}`);
    console.log(`   Statut     : ${data.status || 'non défini'}`);
    console.log(`   Criticité  : ${data.criticity || 'non définie'}`);
    if (data.tags && data.tags.length > 0) {
      console.log(`   Tags       : ${data.tags.join(', ')}`);
    }
    if (data.dependencies && data.dependencies.length > 0) {
      console.log(`   Dépend de  : ${data.dependencies.join(', ')}`);
    }
    if (data.maintainer) {
      console.log(`   Maintainer : ${data.maintainer}`);
    }
    if (caps.length > 0) {
      console.log(`\n   Capacités (${caps.length}) :`);
      for (const cap of caps.slice(0, 10)) {
        console.log(`     - ${cap}`);
      }
      if (caps.length > 10) console.log(`     ... et ${caps.length - 10} autre(s)`);
    }
    if (contracts.length > 0) {
      console.log(`\n   Contrats : ${contracts.join(', ')}`);
    }
    console.log();
  });

agentCommand
  .command('activate')
  .description('Active un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    console.log(`🔧 Activation de l'agent "${id}"...`);
    console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
  });

agentCommand
  .command('deactivate')
  .description('Désactive un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    console.log(`🔧 Désactivation de l'agent "${id}"...`);
    console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
  });

agentCommand
  .command('contract')
  .description('Affiche les contrats associés à un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    const reader = getReader();
    const contract = reader.getAgentContract(id);

    if (!contract) {
      console.log(`ℹ️  Aucun contrat trouvé pour l'agent "${id}"`);
      return;
    }

    console.log(`📜 Contrat de l'agent "${id}" :\n`);
    for (const [key, value] of Object.entries(contract)) {
      if (typeof value === 'string') {
        console.log(`   ${key} : ${value}`);
      } else if (Array.isArray(value)) {
        console.log(`   ${key} : ${(value as string[]).join(', ')}`);
      }
    }
    console.log();
  });

agentCommand
  .command('audit')
  .description('Lance un audit sur le travail d\'un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    console.log(`🔍 Audit de l'agent "${id}"...`);
    console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
  });
