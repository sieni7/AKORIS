import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RegistryReader } from '../src/registry/registry-reader.js';
import { createTempDir, cleanupDir, createFixture, validRegistryIndex, validAgent1, validAgent2 } from './helpers.js';

describe('RegistryReader', () => {
  let dir: string;
  let reader: RegistryReader;

  beforeEach(async () => {
    dir = await createTempDir();
    reader = new RegistryReader(dir);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  describe('loadIndex', () => {
    it('charge l index du Registry', async () => {
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      const index = await reader.loadIndex();
      expect(index.version).toBe('2.0.0');
      expect(index.components.agents.count).toBe(3);
    });

    it('lève une erreur si le fichier est manquant', async () => {
      await expect(reader.loadIndex()).rejects.toThrow('Impossible de charger');
    });

    it('lève une erreur si le fichier est invalide', async () => {
      const { writeFile } = await import('fs/promises');
      const { join } = await import('path');
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      await writeFile(join(dir, 'registry/registry.json'), '{NOT VALID JSON');
      await expect(reader.loadIndex()).rejects.toThrow();
    });
  });

  describe('listAgents', () => {
    it('retourne une liste vide si aucun agent', async () => {
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      const agents = await reader.listAgents();
      expect(agents).toEqual([]);
    });

    it('liste les agents disponibles', async () => {
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      await createFixture(dir, 'registry/agents/CORE-01/agent.json', validAgent1);
      await createFixture(dir, 'registry/agents/DEV-01/agent.json', validAgent2);
      const agents = await reader.listAgents();
      expect(agents).toHaveLength(2);
    });

    it('filtre par domaine', async () => {
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      await createFixture(dir, 'registry/agents/CORE-01/agent.json', validAgent1);
      await createFixture(dir, 'registry/agents/DEV-01/agent.json', validAgent2);
      const agents = await reader.listAgents({ domain: 'CORE' });
      expect(agents).toHaveLength(1);
      expect(agents[0].id).toBe('CORE-01');
    });

    it('filtre par statut', async () => {
      const inactiveAgent = { ...validAgent2, status: 'inactive' as const };
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      await createFixture(dir, 'registry/agents/CORE-01/agent.json', validAgent1);
      await createFixture(dir, 'registry/agents/DEV-01/agent.json', inactiveAgent);
      const agents = await reader.listAgents({ status: 'active' });
      expect(agents).toHaveLength(1);
      expect(agents[0].id).toBe('CORE-01');
    });
  });

  describe('loadAgent', () => {
    it('charge un agent par son ID', async () => {
      await createFixture(dir, 'registry/agents/CORE-01/agent.json', validAgent1);
      const agent = await reader.loadAgent('CORE-01');
      expect(agent.name).toBe('Orchestrator');
    });

    it('lève une erreur si agent introuvable', async () => {
      await expect(reader.loadAgent('INVALID')).rejects.toThrow('Impossible de charger');
    });

    it('lève une erreur si ID ne correspond pas', async () => {
      const mismatch = { ...validAgent1, id: 'OTHER' };
      await createFixture(dir, 'registry/agents/CORE-01/agent.json', mismatch);
      await expect(reader.loadAgent('CORE-01')).rejects.toThrow('ne correspond pas');
    });

    it('lève une erreur si agent.json est malformé', async () => {
      const { writeFile } = await import('fs/promises');
      const { join } = await import('path');
      await createFixture(dir, 'registry/agents/CORE-01/agent.json', validAgent1);
      await writeFile(join(dir, 'registry/agents/CORE-01/agent.json'), '{BROKEN_JSON');
      await expect(reader.loadAgent('CORE-01')).rejects.toThrow('Impossible de charger');
    });
  });

  describe('validate', () => {
    it('retourne valide pour un registry sain', async () => {
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      const report = await reader.validate();
      expect(report.valid).toBe(true);
    });

    it('détecte les dépendances manquantes', async () => {
      const agentWithMissingDep = {
        ...validAgent2,
        dependencies: [{ agentId: 'MISSING-AGENT', type: 'mandatory' as const }],
      };
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      await createFixture(dir, 'registry/agents/DEV-01/agent.json', agentWithMissingDep);
      const report = await reader.validate();
      expect(report.valid).toBe(false);
      expect(report.errors.some(e => e.type === 'dependency')).toBe(true);
    });

    it('détecte les capacités en double', async () => {
      const agentWithDupCaps = {
        ...validAgent1,
        capabilities: [
          { id: 'orchestrate', name: 'Orchestration', description: 'flux', agentId: 'CORE-01', type: 'can' as const },
          { id: 'orchestrate', name: 'Orchestration bis', description: 'flux bis', agentId: 'CORE-01', type: 'can' as const },
        ],
      };
      await createFixture(dir, 'registry/registry.json', validRegistryIndex);
      await createFixture(dir, 'registry/agents/CORE-01/agent.json', agentWithDupCaps);
      const report = await reader.validate();
      expect(report.valid).toBe(false);
      expect(report.errors.some(e => e.type === 'capability')).toBe(true);
    });
  });
});
