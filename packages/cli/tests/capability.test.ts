import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'node:path';
import { RegistryReaderV2 } from '../src/services/registry-reader-v2.service.js';
import { CapabilityResolver } from '../src/services/capability.service.js';

const registryPath = resolve(process.cwd(), '..', '..', 'registry');

describe('CapabilityResolver', () => {
  let reader: RegistryReaderV2;
  let resolver: CapabilityResolver;

  beforeEach(() => {
    reader = new RegistryReaderV2(registryPath);
    reader.clearCache();
    resolver = new CapabilityResolver(reader);
  });

  describe('getRegistry', () => {
    it('retourne le registre des capacités', () => {
      const registry = resolver.getRegistry();
      expect(registry).not.toBeNull();
      expect(registry!.version).toBe('1.0.0');
    });
  });

  describe('findAgents', () => {
    it('trouve les agents pour design_architecture', () => {
      const agents = resolver.findAgents('design_architecture');
      expect(agents).toEqual(['CORE-02', 'DEV-01', 'DEV-02']);
    });

    it('trouve les agents pour une capacité avec un seul agent', () => {
      const agents = resolver.findAgents('design_schema');
      expect(agents).toEqual(['CORE-04']);
    });

    it('retourne un tableau vide pour une capacité inexistante', () => {
      const agents = resolver.findAgents('nonexistent_capability');
      expect(agents).toEqual([]);
    });
  });

  describe('getCapabilities', () => {
    it('retourne les capacités de CORE-02', () => {
      const caps = resolver.getCapabilities('CORE-02');
      expect(caps).toContain('design_architecture');
      expect(caps).toContain('create_adr');
      expect(caps).toContain('review_modules');
    });

    it('retourne les capacités de QA-02 (tests)', () => {
      const caps = resolver.getCapabilities('QA-02');
      expect(caps).toContain('write_unit_tests');
      expect(caps).toContain('write_integration_tests');
      expect(caps).toContain('write_e2e_tests');
    });

    it('retourne un tableau vide pour un agent inconnu', () => {
      const caps = resolver.getCapabilities('UNKNOWN-99');
      expect(caps).toEqual([]);
    });
  });

  describe('findTeam', () => {
    it('compose une équipe pour 2 tâches', () => {
      const team = resolver.findTeam(['design_architecture', 'review_modules']);
      expect(team.size).toBeGreaterThanOrEqual(3);
      const allTasks: string[] = [];
      for (const tasks of team.values()) {
        allTasks.push(...tasks);
      }
      expect(allTasks).toContain('design_architecture');
      expect(allTasks).toContain('review_modules');
    });

    it('un agent peut avoir plusieurs tâches', () => {
      const team = resolver.findTeam(['design_architecture', 'review_modules']);
      let found = false;
      for (const [, tasks] of team) {
        if (tasks.length > 1) found = true;
      }
      expect(found).toBe(true);
    });
  });

  describe('gapAnalysis', () => {
    it('retourne les agents pour une capacité existante', () => {
      const result = resolver.gapAnalysis('design_architecture');
      expect(result.covered).toEqual(['CORE-02', 'DEV-01', 'DEV-02']);
      expect(result.missing).toEqual([]);
    });

    it('signale une capacité manquante', () => {
      const result = resolver.gapAnalysis('fly_to_the_moon');
      expect(result.missing).toEqual(['fly_to_the_moon']);
    });

    it('propose des suggestions pour une capacité inconnue', () => {
      const result = resolver.gapAnalysis('fly_to_the_moon');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('getAllCapabilities', () => {
    it('retourne toutes les clés de capacités', () => {
      const caps = resolver.getAllCapabilities();
      expect(caps.length).toBeGreaterThanOrEqual(69);
      expect(caps).toContain('design_architecture');
      expect(caps).toContain('write_unit_tests');
      expect(caps).toContain('audit_rgpd');
    });
  });

  describe('getTotalCapabilities', () => {
    it('retourne le nombre total de capacités', () => {
      expect(resolver.getTotalCapabilities()).toBeGreaterThanOrEqual(69);
    });
  });

  describe('searchCapabilities', () => {
    it('trouve les capacités contenant "audit"', () => {
      const results = resolver.searchCapabilities('audit');
      expect(results.length).toBeGreaterThanOrEqual(5);
      const names = results.map(r => r.capability);
      expect(names).toContain('audit_vulnerabilities');
      expect(names).toContain('audit_owasp');
      expect(names).toContain('audit_wcag');
      expect(names).toContain('audit_documentation');
      expect(names).toContain('audit_rgpd');
    });

    it('trouve les capacités contenant "design"', () => {
      const results = resolver.searchCapabilities('design');
      expect(results.length).toBeGreaterThanOrEqual(8);
      const names = results.map(r => r.capability);
      expect(names).toContain('design_architecture');
      expect(names).toContain('design_schema');
      expect(names).toContain('design_rest_api');
    });

    it('retourne un tableau vide pour une recherche sans résultat', () => {
      const results = resolver.searchCapabilities('zzzzz');
      expect(results).toEqual([]);
    });

    it('est insensible à la casse', () => {
      const upper = resolver.searchCapabilities('AUDIT');
      const lower = resolver.searchCapabilities('audit');
      expect(upper.length).toBe(lower.length);
    });

    it('chaque résultat a les propriétés requises', () => {
      const results = resolver.searchCapabilities('perf');
      for (const r of results) {
        expect(r).toHaveProperty('capability');
        expect(r).toHaveProperty('agents');
        expect(Array.isArray(r.agents)).toBe(true);
      }
    });
  });
});
