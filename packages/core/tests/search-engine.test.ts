import { describe, it, expect } from 'vitest';
import { SearchEngine } from '../src/search-engine.js';
import type { Agent } from '../src/types.js';

function makeAgents(): Agent[] {
  return [
    {
      id: 'agent-orchestrator',
      name: 'Orchestrator',
      domain: 'CORE',
      criticity: 'critique',
      status: 'active',
      version: '1.0.0',
      description: 'Main orchestrator agent for workflow planning',
      tags: ['orchestration', 'core'],
      dependencies: [],
      capabilities: [{ id: 'cap-1', name: 'plan', description: 'Plan workflows', agentId: 'agent-orchestrator', type: 'can' }],
    },
    {
      id: 'agent-qa',
      name: 'QA Validator',
      domain: 'QA',
      criticity: 'haute',
      status: 'active',
      version: '2.0.0',
      description: 'Quality assurance and validation agent',
      tags: ['qa', 'testing'],
      dependencies: [],
      capabilities: [{ id: 'cap-2', name: 'validate', description: 'Validate quality gates', agentId: 'agent-qa', type: 'can' }],
    },
  ];
}

describe('SearchEngine', () => {
  it('should find agents by name', () => {
    const agents = new Map(makeAgents().map((a) => [a.id, a]));
    const engine = new SearchEngine(agents);
    const result = engine.search({ q: 'orchestrator' });
    expect(result.count).toBe(1);
    expect(result.agents[0].id).toBe('agent-orchestrator');
  });

  it('should find agents by description', () => {
    const agents = new Map(makeAgents().map((a) => [a.id, a]));
    const engine = new SearchEngine(agents);
    const result = engine.search({ q: 'quality' });
    expect(result.count).toBe(1);
    expect(result.agents[0].id).toBe('agent-qa');
  });

  it('should return empty for no matches', () => {
    const agents = new Map(makeAgents().map((a) => [a.id, a]));
    const engine = new SearchEngine(agents);
    const result = engine.search({ q: 'nonexistent' });
    expect(result.count).toBe(0);
  });

  it('should respect limit', () => {
    const agents = new Map(makeAgents().map((a) => [a.id, a]));
    const engine = new SearchEngine(agents);
    const result = engine.search({ q: 'agent', limit: 1 });
    expect(result.count).toBeLessThanOrEqual(1);
  });
});
