import { describe, it, expect } from 'vitest';
import { RegistryReader } from '../src/registry-reader.js';
import type { Agent } from '../src/types.js';

const seedAgent: Agent = {
  id: 'agent-orchestrator',
  name: 'Orchestrator',
  domain: 'CORE',
  criticity: 'critique',
  status: 'active',
  version: '1.0.0',
  description: 'Main orchestrator agent',
  tags: ['orchestration', 'core'],
  dependencies: [],
  capabilities: [{ id: 'cap-1', name: 'plan', description: 'Plan workflows', agentId: 'agent-orchestrator', type: 'can' }],
};

describe('RegistryReader', () => {
  it('should return index with domains', () => {
    const reader = new RegistryReader([seedAgent]);
    const index = reader.loadIndex();
    expect(index.domains).toContain('CORE');
    expect(index.agentCount).toBe(1);
  });

  it('should list agents with filters', () => {
    const reader = new RegistryReader([seedAgent]);
    const { agents, count } = reader.listAgents({ domain: 'CORE' });
    expect(count).toBe(1);
    expect(agents[0].id).toBe('agent-orchestrator');
  });

  it('should return empty for non-matching filter', () => {
    const reader = new RegistryReader([seedAgent]);
    const { count } = reader.listAgents({ domain: 'QA' });
    expect(count).toBe(0);
  });

  it('should load agent by id', () => {
    const reader = new RegistryReader([seedAgent]);
    const agent = reader.loadAgent('agent-orchestrator');
    expect(agent.name).toBe('Orchestrator');
  });

  it('should throw NotFoundError for unknown agent', () => {
    const reader = new RegistryReader();
    expect(() => reader.loadAgent('unknown')).toThrow('not found');
  });

  it('should register new agent', () => {
    const reader = new RegistryReader();
    reader.registerAgent(seedAgent);
    expect(reader.loadIndex().agentCount).toBe(1);
  });
});
