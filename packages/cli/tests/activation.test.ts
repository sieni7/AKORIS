import { describe, it, expect, beforeEach } from 'vitest';
import { resolve } from 'node:path';
import { RegistryReaderV2 } from '../src/services/registry-reader-v2.service.js';
import { ActivationEngine } from '../src/services/activation.service.js';

const registryPath = resolve(process.cwd(), '..', '..', 'registry');

describe('ActivationEngine', () => {
  let reader: RegistryReaderV2;
  let engine: ActivationEngine;

  beforeEach(() => {
    reader = new RegistryReaderV2(registryPath);
    reader.clearCache();
    engine = new ActivationEngine(reader);
  });

  describe('getMatrix', () => {
    it('retourne la matrice d activation', () => {
      const matrix = engine.getMatrix();
      expect(matrix).not.toBeNull();
      expect(matrix!.version).toBe('1.0.0');
    });
  });

  describe('getAgentsForEvent', () => {
    it('retourne les agents pour RELEASE_PREP (7 agents)', () => {
      const agents = engine.getAgentsForEvent('RELEASE_PREP');
      expect(agents).toHaveLength(7);
      expect(agents).toContain('CORE-01');
      expect(agents).toContain('GOV-02');
      expect(agents).toContain('QA-03');
    });

    it('retourne les agents pour CODE_REVIEW (1 agent)', () => {
      const agents = engine.getAgentsForEvent('CODE_REVIEW');
      expect(agents).toEqual(['QA-01']);
    });

    it('retourne un tableau vide pour un événement inconnu', () => {
      const agents = engine.getAgentsForEvent('UNKNOWN_EVENT');
      expect(agents).toEqual([]);
    });
  });

  describe('getEventsForAgent', () => {
    it('retourne les événements pour CORE-01', () => {
      const events = engine.getEventsForAgent('CORE-01');
      expect(events.length).toBeGreaterThanOrEqual(3);
      const eventIds = events.map(e => e.event);
      expect(eventIds).toContain('PROJECT_INIT');
      expect(eventIds).toContain('SPRINT_START');
      expect(eventIds).toContain('RELEASE_PREP');
    });

    it('retourne les événements pour CORE-06', () => {
      const events = engine.getEventsForAgent('CORE-06');
      const eventIds = events.map(e => e.event);
      expect(eventIds).toContain('DOCUMENTATION_AUDIT');
      expect(eventIds).toContain('RELEASE_APPROVED');
      expect(eventIds).toContain('PROJECT_RETRO');
    });

    it('retourne un tableau vide pour un agent sans événement', () => {
      const events = engine.getEventsForAgent('UNKNOWN-99');
      expect(events).toEqual([]);
    });

    it('chaque événement retourné a les bons champs', () => {
      const events = engine.getEventsForAgent('QA-03');
      for (const evt of events) {
        expect(evt).toHaveProperty('event');
        expect(evt).toHaveProperty('description');
        expect(evt).toHaveProperty('phase');
        expect(evt).toHaveProperty('frequency');
      }
    });
  });

  describe('getFrequency', () => {
    it('retourne "once" pour PROJECT_INIT', () => {
      expect(engine.getFrequency('PROJECT_INIT')).toBe('once');
    });

    it('retourne "per-sprint" pour SPRINT_START', () => {
      expect(engine.getFrequency('SPRINT_START')).toBe('per-sprint');
    });

    it('retourne null pour un événement inconnu', () => {
      expect(engine.getFrequency('UNKNOWN')).toBeNull();
    });
  });

  describe('getPhase', () => {
    it('retourne "initiation" pour PROJECT_INIT', () => {
      expect(engine.getPhase('PROJECT_INIT')).toBe('initiation');
    });

    it('retourne "quality" pour SECURITY_AUDIT', () => {
      expect(engine.getPhase('SECURITY_AUDIT')).toBe('quality');
    });

    it('retourne null pour un événement inconnu', () => {
      expect(engine.getPhase('UNKNOWN')).toBeNull();
    });
  });

  describe('getEventsByPhase', () => {
    it('regroupe les événements par phase', () => {
      const byPhase = engine.getEventsByPhase();
      expect(byPhase).toHaveProperty('initiation');
      expect(byPhase).toHaveProperty('development');
      expect(byPhase).toHaveProperty('quality');
      expect(byPhase).toHaveProperty('release');
    });

    it('la phase quality contient 6 événements', () => {
      const byPhase = engine.getEventsByPhase();
      expect(byPhase.quality).toHaveLength(6);
    });

    it('la phase release contient 2 événements', () => {
      const byPhase = engine.getEventsByPhase();
      expect(byPhase.release).toHaveLength(2);
    });
  });

  describe('getAllEvents', () => {
    it('retourne les 18 événements', () => {
      const events = engine.getAllEvents();
      expect(events).toHaveLength(18);
    });

    it('chaque événement a les propriétés requises', () => {
      const events = engine.getAllEvents();
      for (const evt of events) {
        expect(evt).toHaveProperty('id');
        expect(evt).toHaveProperty('description');
        expect(evt).toHaveProperty('agents');
        expect(evt).toHaveProperty('frequency');
        expect(evt).toHaveProperty('phase');
        expect(Array.isArray(evt.agents)).toBe(true);
      }
    });
  });

  describe('getEventCount', () => {
    it('retourne 18', () => {
      expect(engine.getEventCount()).toBe(18);
    });
  });
});
