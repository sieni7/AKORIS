import { mkdir, writeFile, rm } from 'fs/promises';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

export async function createTempDir(): Promise<string> {
  const dir = join(tmpdir(), `akoris-test-${randomUUID()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function cleanupDir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}

export async function createFixture(projectRoot: string, subPath: string, content: unknown): Promise<void> {
  const fullPath = join(projectRoot, subPath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, JSON.stringify(content, null, 2));
}

export const validRegistryIndex = {
  version: '2.0.0',
  components: {
    agents: { count: 3, path: 'registry/agents' },
    policies: { count: 5, path: 'registry/policies' },
    rules: { count: 10, path: 'registry/rules' },
  },
  domains: [
    { id: 'CORE', name: 'Core', agentCount: 2, color: '#FF6B6B' },
    { id: 'DEV', name: 'Development', agentCount: 1, color: '#4ECDC4' },
  ],
};

export const validAgent1 = {
  id: 'CORE-01',
  name: 'Orchestrator',
  domain: 'CORE',
  criticity: 'critique' as const,
  status: 'active' as const,
  version: '1.0.0',
  description: 'Agent orchestrateur principal',
  tags: ['core', 'orchestration'],
  dependencies: [],
  capabilities: [{ id: 'orchestrate', name: 'Orchestration', description: 'Orchestration des flux', agentId: 'CORE-01', type: 'can' as const }],
};

export const validAgent2 = {
  id: 'DEV-01',
  name: 'Developer',
  domain: 'DEV',
  criticity: 'haute' as const,
  status: 'active' as const,
  version: '1.0.0',
  description: 'Agent développeur',
  tags: ['dev'],
  dependencies: [{ agentId: 'CORE-01', type: 'mandatory' as const }],
  capabilities: [{ id: 'code', name: 'Codage', description: 'Écriture de code', agentId: 'DEV-01', type: 'can' as const }],
};

export const validStateMachine = {
  version: '1.0.0',
  states: [
    { id: 'DRAFT', name: 'Brouillon', phase: 'initial', description: 'Projet en brouillon' },
    { id: 'REVIEW', name: 'En révision', phase: 'review', description: 'Projet en révision' },
  ],
  transitions: [
    { from: 'DRAFT', to: 'REVIEW', requiredGates: ['QG-001'], authorizedBy: ['CORE-01'], description: 'Soumettre en révision' },
  ],
};
