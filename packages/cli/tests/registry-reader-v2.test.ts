import { describe, it, expect, beforeEach } from 'vitest';
import { RegistryReaderV2 } from '../src/services/registry-reader-v2.service.js';
import { join, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const registryPath = resolve(process.cwd(), '..', '..', 'registry');

describe('RegistryReaderV2', () => {
  let reader: RegistryReaderV2;

  beforeEach(() => {
    reader = new RegistryReaderV2(registryPath);
    reader.clearCache();
  });

  describe('construction', () => {
    it('utilise le chemin fourni', () => {
      const r = new RegistryReaderV2('/custom/path');
      expect(r).toBeInstanceOf(RegistryReaderV2);
    });

    it('utilise le chemin par défaut (registry/)', () => {
      const r = new RegistryReaderV2();
      expect(r).toBeInstanceOf(RegistryReaderV2);
    });
  });

  describe('getIndex', () => {
    it('retourne l index du Registry v2', () => {
      const index = reader.getIndex();
      expect(index).not.toBeNull();
      expect(index!.version).toBe('2.0.0');
      expect(index!.components.agents.count).toBe(33);
      expect(index!.domains).toHaveLength(5);
    });

    it('contient les bons domaines', () => {
      const index = reader.getIndex()!;
      const domainIds = index.domains.map(d => d.id);
      expect(domainIds).toEqual(['CORE', 'DEV', 'QA', 'EXP', 'GOV']);
    });

    it('utilise le cache lors d appels répétés', () => {
      const first = reader.getIndex();
      const second = reader.getIndex();
      expect(first).toEqual(second);
    });
  });

  describe('getStateMachine', () => {
    it('retourne la machine à états', () => {
      const sm = reader.getStateMachine();
      expect(sm).not.toBeNull();
      expect(sm!.version).toBe('1.0.0');
      expect(sm!.initialState).toBe('Draft');
      expect(sm!.states).toHaveLength(7);
      expect(sm!.transitions).toHaveLength(8);
    });
  });

  describe('getActivationMatrix', () => {
    it('retourne la matrice d activation', () => {
      const am = reader.getActivationMatrix();
      expect(am).not.toBeNull();
      expect(am!.version).toBe('1.0.0');
      expect(Object.keys(am!.events)).toHaveLength(18);
    });

    it('PROJECT_INIT active CORE-01, CORE-02, GOV-01', () => {
      const am = reader.getActivationMatrix()!;
      expect(am.events.PROJECT_INIT.agents).toEqual(['CORE-01', 'CORE-02', 'GOV-01']);
    });
  });

  describe('getCapabilityRegistry', () => {
    it('retourne le registre des capacités', () => {
      const cr = reader.getCapabilityRegistry();
      expect(cr).not.toBeNull();
      expect(cr!.version).toBe('1.0.0');
      expect(Object.keys(cr!.capabilities).length).toBeGreaterThanOrEqual(69);
    });
  });

  describe('getDependencyGraph', () => {
    it('retourne le graphe de dépendances', () => {
      const dg = reader.getDependencyGraph();
      expect(dg).not.toBeNull();
    });
  });

  describe('getRules', () => {
    it('retourne les règles du Registry', () => {
      const rules = reader.getRules();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0]).toHaveProperty('id');
      expect(rules[0]).toHaveProperty('name');
      expect(rules[0]).toHaveProperty('severity');
    });
  });

  describe('getDeliverables', () => {
    it('retourne les livrables', () => {
      const deliverables = reader.getDeliverables();
      expect(deliverables.length).toBeGreaterThan(0);
    });
  });

  describe('getEvents', () => {
    it('retourne les événements', () => {
      const events = reader.getEvents();
      expect(events.length).toBe(18);
    });
  });

  describe('validate', () => {
    it('valide le Registry comme valide', () => {
      const result = reader.validate();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('summary', () => {
    it('retourne un résumé des composants', () => {
      const summary = reader.summary();
      expect(summary.events).toBe(18);
      expect(summary.rules).toBeGreaterThan(0);
      expect(summary.deliverables).toBeGreaterThan(0);
    });
  });

  describe('cache et TTL', () => {
    it('setCacheTTL modifie la durée de vie', () => {
      reader.setCacheTTL(1000);
      expect(() => reader.setCacheTTL(5000)).not.toThrow();
    });

    it('invalidateCache vide le cache', () => {
      const first = reader.getIndex();
      reader.invalidateCache();
      const second = reader.getIndex();
      expect(first).toEqual(second);
    });

    it('invalidateCache avec pattern supprime une entrée spécifique', () => {
      reader.getIndex();
      reader.invalidateCache('index');
      const result = reader.getIndex();
      expect(result).not.toBeNull();
    });
  });

  describe('getAgentContract', () => {
    it('retourne le contrat d un agent existant', () => {
      const contract = reader.getAgentContract('CORE-01');
      expect(contract).not.toBeNull();
    });

    it('retourne null pour un agent inexistant', () => {
      const contract = reader.getAgentContract('UNKNOWN-99');
      expect(contract).toBeNull();
    });
  });

  describe('getAgentCapabilities', () => {
    it('retourne les capacités d un agent existant', () => {
      const caps = reader.getAgentCapabilities('CORE-01');
      expect(caps).not.toBeNull();
      expect(caps).toHaveProperty('can');
    });
  });

  describe('findAgentDir', () => {
    it('trouve le répertoire d un agent existant', () => {
      const dir = reader.findAgentDir('CORE-01');
      expect(dir).not.toBeNull();
      expect(dir).toContain('CORE-01');
    });

    it('retourne null pour un agent inexistant', () => {
      const dir = reader.findAgentDir('UNKNOWN-99');
      expect(dir).toBeNull();
    });
  });
});
