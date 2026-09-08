import { describe, it, expect } from 'vitest';
import type { Agent } from '../src/types.js';
import { RegistryReader } from '../src/engines/registry-reader.js';
import { NotFoundError } from '../src/errors.js';
import { MOCK_AGENTS, MOCK_AGENT_COUNT } from './fixtures/agents.js';

const baseAgent = (over: Partial<Agent>): Agent => ({
  id: 'X-01',
  name: 'Base',
  version: '1.0.0',
  domain: 'CORE',
  criticity: 'moyenne',
  status: 'active',
  mission: 'Test',
  responsibilities: ['responsabilite-test'],
  limits: [],
  dependencies: [],
  capabilities: [
    { id: 'X-01-CAP-01', name: 'can_tester', description: 't', type: 'can' },
  ],
  ...over,
});

describe('RegistryReader', () => {
  it('loadIndex: agentCount dérivé de la collection (40 mocks)', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const index = reader.loadIndex();
    expect(index.agentCount).toBe(MOCK_AGENT_COUNT);
    expect(index.agentCount).toBe(40);
    expect(index.domains).toEqual(['CORE', 'DEV', 'EXP', 'GOV', 'QA']);
    expect(index.version).toBeTruthy();
    expect(index.lastUpdated).toBeTruthy();
  });

  it('listAgents sans filtre retourne les 40 agents', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const { agents, count } = reader.listAgents();
    expect(count).toBe(40);
    expect(agents.length).toBe(40);
  });

  it('listAgents filtre par domaine', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const { agents, count } = reader.listAgents({ domain: 'QA' });
    expect(count).toBe(8);
    expect(agents.every((a) => a.domain === 'QA')).toBe(true);
  });

  it('listAgents filtre par statut', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const { count } = reader.listAgents({ status: 'active' });
    expect(count).toBe(40);
  });

  it('listAgents filtre par criticité', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const { agents, count } = reader.listAgents({ criticity: 'critique' });
    expect(count).toBeGreaterThan(0);
    expect(agents.every((a) => a.criticity === 'critique')).toBe(true);
  });

  it('listAgents filtre par tag (responsabilité)', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const { agents, count } = reader.listAgents({ tag: 'Production de code' });
    expect(count).toBe(1);
    expect(agents[0].id).toBe('DEV-01');
  });

  it('loadAgent retourne l\'agent existant', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const a = reader.loadAgent('CORE-01');
    expect(a.id).toBe('CORE-01');
    expect(a.domain).toBe('CORE');
  });

  it('loadAgent lève NotFoundError pour un agent absent', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    expect(() => reader.loadAgent('INCONNU-99')).toThrow(NotFoundError);
    expect(() => reader.loadAgent('INCONNU-99')).toThrow('Agent');
  });

  it('getDependencies retourne les dépendances', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const deps = reader.getDependencies('DEV-01');
    expect(deps.map((d) => d.agentId)).toEqual(['CORE-01', 'CORE-02']);
  });

  it('getCapabilities retourne les capacités', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const caps = reader.getCapabilities('CORE-01');
    expect(caps.length).toBeGreaterThan(0);
    expect(caps.some((c) => c.type === 'cannot')).toBe(true);
  });

  it('validateDependencies: fixture propre sans problème', () => {
    const reader = new RegistryReader(MOCK_AGENTS);
    const issues = reader.validateDependencies();
    expect(issues).toEqual([]);
  });

  it('validateDependencies: détecte un cycle', () => {
    const a = baseAgent({ id: 'A-01' });
    const b = baseAgent({ id: 'A-02' });
    a.dependencies = [{ agentId: 'A-02', type: 'mandatory' }];
    b.dependencies = [{ agentId: 'A-01', type: 'mandatory' }];
    const reader = new RegistryReader([a, b]);
    const issues = reader.validateDependencies();
    expect(issues.some((i) => i.category === 'cycle')).toBe(true);
  });

  it('validateDependencies: detecte une dépendance mandatory absente en error', () => {
    const a = baseAgent({ id: 'A-01', dependencies: [{ agentId: 'GHOST-99', type: 'mandatory' }] });
    const reader = new RegistryReader([a]);
    const issues = reader.validateDependencies();
    expect(issues).toHaveLength(1);
    expect(issues[0].category).toBe('missing-dependency');
    expect(issues[0].severity).toBe('error');
  });

  it('validateDependencies: une référence optionnelle absente en warning', () => {
    const a = baseAgent({ id: 'A-01', dependencies: [{ agentId: 'GHOST-99', type: 'optional' }] });
    const reader = new RegistryReader([a]);
    const issues = reader.validateDependencies();
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('validateDependencies: référence vers un agent inactif signalée', () => {
    const inactive = baseAgent({ id: 'A-02', status: 'deprecated' });
    const a = baseAgent({ id: 'A-01', dependencies: [{ agentId: 'A-02', type: 'mandatory' }] });
    const reader = new RegistryReader([a, inactive]);
    const issues = reader.validateDependencies();
    expect(issues.some((i) => i.category === 'inactive-reference')).toBe(true);
  });

  it('construit depuis un sous-ensemble (agentCount dérivé)', () => {
    const reader = new RegistryReader(MOCK_AGENTS.slice(0, 3));
    expect(reader.count).toBe(3);
    expect(reader.loadIndex().agentCount).toBe(3);
  });
});