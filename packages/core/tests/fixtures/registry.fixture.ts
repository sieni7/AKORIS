import { createFixture } from '../helpers.js';

export async function createRegistryFixture(root: string, extraAgents?: Record<string, any>): Promise<void> {
  await createFixture(root, 'registry/registry.json', {
    version: '2.0.0',
    components: {
      agents: { count: 2 + (extraAgents ? Object.keys(extraAgents).length : 0), path: 'registry/agents' },
      policies: { count: 5, path: 'registry/policies' },
      rules: { count: 10, path: 'registry/rules' },
    },
    domains: [
      { id: 'CORE', name: 'Core', agentCount: 1, color: '#FF6B6B' },
      { id: 'DEV', name: 'Development', agentCount: 1, color: '#4ECDC4' },
    ],
  });

  await createFixture(root, 'registry/agents/CORE-01/agent.json', {
    id: 'CORE-01',
    name: 'Orchestrator',
    domain: 'CORE',
    criticity: 'critique',
    status: 'active',
    version: '1.0.0',
    description: 'Agent orchestrateur principal',
    tags: ['core', 'orchestration'],
    dependencies: [],
    capabilities: [{ id: 'orchestrate', name: 'Orchestration', description: 'Orchestration des flux', agentId: 'CORE-01', type: 'can' }],
  });

  await createFixture(root, 'registry/agents/DEV-01/agent.json', {
    id: 'DEV-01',
    name: 'Developer',
    domain: 'DEV',
    criticity: 'haute',
    status: 'active',
    version: '1.0.0',
    description: 'Agent développeur',
    tags: ['dev'],
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory' }],
    capabilities: [{ id: 'code', name: 'Codage', description: 'Écriture de code', agentId: 'DEV-01', type: 'can' }],
  });

  if (extraAgents) {
    for (const [id, data] of Object.entries(extraAgents)) {
      await createFixture(root, `registry/agents/${id}/agent.json`, data);
    }
  }
}
