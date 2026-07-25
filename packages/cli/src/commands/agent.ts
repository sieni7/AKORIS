import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';
import type { Agent } from '../types/index.js';

export const agentCommand = new Command('agent')
  .description('Gère les agents AKORIS');

agentCommand
  .command('list')
  .description('Liste tous les agents du Registry')
  .action(() => {
    const registry = new RegistryService();
    const agents = registry.getAgents() as Agent[];

    if (!agents || agents.length === 0) {
      console.log('ℹ️  Aucun agent trouvé dans le Registry');
      return;
    }

    console.log('🤖 Agents disponibles :\n');
    for (const agent of agents) {
      console.log(`   🧠 ${agent.name} (${agent.id})`);
      console.log(`      Domaine : ${agent.domain}`);
      console.log(`      Capacités : ${agent.capabilities?.join(', ') || 'aucune'}`);
      console.log();
    }
  });

agentCommand
  .command('info')
  .description('Affiche les détails d\'un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    const registry = new RegistryService();
    const agent = registry.getAgent(id) as Agent | null;

    if (!agent) {
      console.error(`❌ Agent "${id}" introuvable`);
      process.exit(1);
    }

    console.log(`🤖 Agent : ${agent.name}\n`);
    console.log(`   ID         : ${agent.id}`);
    console.log(`   Version    : ${agent.version}`);
    console.log(`   Domaine    : ${agent.domain}`);
    console.log(`   Contrats   : ${agent.contracts?.join(', ') || 'aucun'}`);
    console.log(`   Politiques : ${agent.policies?.join(', ') || 'aucune'}`);
    console.log(`   Capacités  : ${agent.capabilities?.join(', ') || 'aucune'}`);
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
    const registry = new RegistryService();
    const agent = registry.getAgent(id) as Agent | null;

    if (!agent) {
      console.error(`❌ Agent "${id}" introuvable`);
      process.exit(1);
    }

    const contractIds = agent.contracts || [];

    if (contractIds.length === 0) {
      console.log(`ℹ️  Aucun contrat associé à l'agent "${agent.name}"`);
      return;
    }

    console.log(`📜 Contrats de l'agent "${agent.name}" :\n`);

    for (const cid of contractIds) {
      const contract = registry.getContract(cid);
      if (contract) {
        console.log(`   📄 ${contract.name} (${cid})`);
        if (contract.description) console.log(`      ${contract.description}`);
        console.log();
      } else {
        console.log(`   ⚠️  Contrat "${cid}" introuvable`);
      }
    }
  });

agentCommand
  .command('audit')
  .description('Lance un audit sur le travail d\'un agent')
  .argument('<id>', 'Identifiant de l\'agent')
  .action((id: string) => {
    console.log(`🔍 Audit de l'agent "${id}"...`);
    console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
  });
