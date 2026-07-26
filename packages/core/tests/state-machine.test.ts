import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StateMachineEngine } from '../src/state/state-machine.js';
import { createTempDir, cleanupDir, createFixture, validStateMachine } from './helpers.js';

describe('StateMachineEngine', () => {
  let dir: string;
  let engine: StateMachineEngine;

  beforeEach(async () => {
    dir = await createTempDir();
    engine = new StateMachineEngine(dir);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  describe('loadMachine', () => {
    it('charge la machine à états', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const machine = await engine.loadMachine();
      expect(machine.version).toBe('1.0.0');
      expect(machine.states).toHaveLength(2);
    });

    it('lève une erreur si le fichier est manquant', async () => {
      await expect(engine.loadMachine()).rejects.toThrow('Impossible de charger');
    });
  });

  describe('getCurrentState', () => {
    it('retourne DRAFT par défaut', async () => {
      const state = await engine.getCurrentState();
      expect(state).toBe('DRAFT');
    });

    it('retourne l état depuis state.json', async () => {
      await createFixture(dir, '.akoris/state.json', { currentState: 'REVIEW', history: [], lastTransition: null });
      const state = await engine.getCurrentState();
      expect(state).toBe('REVIEW');
    });
  });

  describe('getHistory', () => {
    it('retourne un tableau vide par défaut', async () => {
      const history = await engine.getHistory();
      expect(history).toEqual([]);
    });
  });

  describe('canTransition', () => {
    it('autorise une transition valide', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const result = await engine.canTransition('DRAFT', 'REVIEW');
      expect(result.allowed).toBe(true);
    });

    it('refuse une transition invalide', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const result = await engine.canTransition('REVIEW', 'DRAFT');
      expect(result.allowed).toBe(false);
    });

    it('refuse si transition inexistante', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const result = await engine.canTransition('UNKNOWN', 'DRAFT');
      expect(result.allowed).toBe(false);
    });

    it('retourne les gates requis pour une transition conditionnelle', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const result = await engine.canTransition('DRAFT', 'REVIEW');
      expect(result.requiredGates).toContain('QG-001');
      expect(result.missingGates).toBeDefined();
    });
  });

  describe('transition', () => {
    it('exécute une transition autorisée', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      await createFixture(dir, '.akoris/state.json', { currentState: 'DRAFT', history: [], lastTransition: null });
      const entry = await engine.transition('DRAFT', 'REVIEW');
      expect(entry.from).toBe('DRAFT');
      expect(entry.to).toBe('REVIEW');
      expect(entry.id).toBeTruthy();
    });

    it('refuse si l état actuel ne correspond pas', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      await createFixture(dir, '.akoris/state.json', { currentState: 'REVIEW', history: [], lastTransition: null });
      await expect(engine.transition('DRAFT', 'REVIEW')).rejects.toThrow("L'état actuel est REVIEW");
    });

    it('refuse une transition non autorisée', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      await expect(engine.transition('DRAFT', 'ARCHIVED')).rejects.toThrow('non autorisée');
    });
  });

  describe('exportReport', () => {
    it('exporte en JSON', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const report = await engine.exportReport('json');
      const parsed = JSON.parse(report);
      expect(parsed.currentState).toBe('DRAFT');
    });

    it('exporte en texte', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const report = await engine.exportReport('text');
      expect(report).toContain('État');
    });

    it('exporte en markdown', async () => {
      await createFixture(dir, 'registry/state-machine.json', validStateMachine);
      const report = await engine.exportReport('markdown');
      expect(report).toContain('# Rapport');
    });
  });
});
