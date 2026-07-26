import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SearchEngine } from '../src/search/search-engine.js';
import { createTempDir, cleanupDir, createFixture, validRegistryIndex, validAgent1, validAgent2 } from './helpers.js';

describe('SearchEngine', () => {
  let dir: string;
  let engine: SearchEngine;

  beforeEach(async () => {
    dir = await createTempDir();
    engine = new SearchEngine(dir);
    await createFixture(dir, 'registry/registry.json', validRegistryIndex);
    await createFixture(dir, 'registry/agents/CORE-01/agent.json', validAgent1);
    await createFixture(dir, 'registry/agents/DEV-01/agent.json', validAgent2);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  describe('search', () => {
    it('retourne les agents dont le nom correspond', async () => {
      const results = await engine.search('Orchestrator');
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('agent');
      expect(results[0].id).toBe('CORE-01');
    });

    it('retourne les agents dont la description correspond', async () => {
      const results = await engine.search('développeur');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('DEV-01');
    });

    it('est insensible à la casse', async () => {
      const results = await engine.search('ORCHESTRATOR');
      expect(results).toHaveLength(1);
    });

    it('retourne un tableau vide si aucun résultat', async () => {
      const results = await engine.search('ZZZZZZ');
      expect(results).toEqual([]);
    });

    it('limite à 50 résultats', async () => {
      for (let i = 0; i < 60; i++) {
        const agent = { ...validAgent1, id: `AGENT-${i}`, name: `Searchable-${i}` };
        await createFixture(dir, `registry/agents/AGENT-${i}/agent.json`, agent);
      }
      const results = await engine.search('Searchable');
      expect(results.length).toBeLessThanOrEqual(50);
    });

    it('trie par score décroissant', async () => {
      const agentExact = { ...validAgent1, id: 'EXACT', name: 'database' };
      const agentPartial = { ...validAgent2, id: 'PARTIAL', name: 'database-admin' };
      await createFixture(dir, 'registry/agents/EXACT/agent.json', agentExact);
      await createFixture(dir, 'registry/agents/PARTIAL/agent.json', agentPartial);
      const results = await engine.search('database');
      expect(results[0].id).toBe('EXACT');
      expect(results[0].score).toBeGreaterThan(results[1].score);
    });
  });
});
