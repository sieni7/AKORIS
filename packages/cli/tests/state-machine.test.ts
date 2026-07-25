import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resolve } from 'node:path';
import { existsSync, readFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { RegistryReaderV2 } from '../src/services/registry-reader-v2.service.js';
import { StateMachineEngine } from '../src/services/state-machine.service.js';

const registryPath = resolve(process.cwd(), '..', '..', 'registry');
const testProjectPath = resolve(process.cwd(), '.akoris-test');

function cleanupTestState() {
  try {
    const statePath = `${testProjectPath}/.akoris/state.json`;
    if (existsSync(statePath)) unlinkSync(statePath);
    const dir = `${testProjectPath}/.akoris`;
    if (existsSync(dir)) {
      const files = ['state.json', 'state-history.json'];
      for (const f of files) {
        try {
          if (existsSync(`${dir}/${f}`)) unlinkSync(`${dir}/${f}`);
        } catch { }
      }
    }
  } catch { }
}

describe('StateMachineEngine', () => {
  let reader: RegistryReaderV2;
  let engine: StateMachineEngine;

  beforeEach(() => {
    reader = new RegistryReaderV2(registryPath);
    reader.clearCache();
    cleanupTestState();
    engine = new StateMachineEngine(reader, testProjectPath);
  });

  afterEach(() => {
    cleanupTestState();
  });

  describe('getMachine', () => {
    it('retourne la machine à états', () => {
      const machine = engine.getMachine();
      expect(machine).not.toBeNull();
      expect(machine!.name).toBe('AKORIS Project State Machine');
    });
  });

  describe('getStates', () => {
    it('retourne les 7 états', () => {
      const states = engine.getStates();
      expect(states).toHaveLength(7);
      const ids = states.map(s => s.id);
      expect(ids).toEqual(['Draft', 'Planned', 'Active', 'Audit', 'Validated', 'Released', 'Archived']);
    });
  });

  describe('getInitialState', () => {
    it('retourne Draft', () => {
      expect(engine.getInitialState()).toBe('Draft');
    });
  });

  describe('canTransition', () => {
    it('autorise Draft → Planned', () => {
      const result = engine.canTransition('Draft', 'Planned');
      expect(result.allowed).toBe(true);
    });

    it('refuse Draft → Released (saut d états)', () => {
      const result = engine.canTransition('Draft', 'Released');
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('non définie');
    });

    it('refuse une transition depuis un état inexistant', () => {
      const result = engine.canTransition('Unknown', 'Draft');
      expect(result.allowed).toBe(false);
    });

    it('autorise Active → Planned (retour)', () => {
      const result = engine.canTransition('Active', 'Planned');
      expect(result.allowed).toBe(true);
    });

    it('autorise Audit → Active (retour en dev)', () => {
      const result = engine.canTransition('Audit', 'Active');
      expect(result.allowed).toBe(true);
    });

    it('fournit des suggestions pour les transitions possibles', () => {
      const result = engine.canTransition('Draft', 'Archived');
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Planned');
    });
  });

  describe('getAvailableTransitions', () => {
    it('retourne les transitions depuis Draft', () => {
      const transitions = engine.getAvailableTransitions('Draft');
      expect(transitions).toHaveLength(1);
      expect(transitions[0].to).toBe('Planned');
      expect(transitions[0].authorizedBy).toBe('GOV-02');
    });

    it('retourne les transitions depuis Active', () => {
      const transitions = engine.getAvailableTransitions('Active');
      expect(transitions).toHaveLength(2);
      const toStates = transitions.map(t => t.to);
      expect(toStates).toContain('Audit');
      expect(toStates).toContain('Planned');
    });

    it('retourne un tableau vide depuis Archived', () => {
      const transitions = engine.getAvailableTransitions('Archived');
      expect(transitions).toHaveLength(0);
    });
  });

  describe('getRequiredGates', () => {
    it('retourne les gates pour Draft → Planned', () => {
      const gates = engine.getRequiredGates('Draft', 'Planned');
      expect(gates).toEqual(['ADR validés', 'Architecture définie', 'Backlog priorisé']);
    });
  });

  describe('getAuthorizedAgent', () => {
    it('retourne GOV-02 pour Draft → Planned', () => {
      expect(engine.getAuthorizedAgent('Draft', 'Planned')).toBe('GOV-02');
    });

    it('retourne CORE-01 pour Active → Planned', () => {
      expect(engine.getAuthorizedAgent('Active', 'Planned')).toBe('CORE-01');
    });
  });

  describe('projet sans état persistant', () => {
    it('getCurrentState retourne Draft', () => {
      expect(engine.getCurrentState()).toBe('Draft');
    });

    it('readProjectState retourne null', () => {
      expect(engine.readProjectState()).toBeNull();
    });

    it('getHistory retourne un tableau vide', () => {
      expect(engine.getHistory()).toEqual([]);
    });
  });

  describe('transition', () => {
    it('exécute Draft → Planned avec succès', () => {
      const result = engine.transition('Draft', 'Planned');
      expect(result.success).toBe(true);
      expect(result.message).toContain('Planned');
      expect(result.gates).toHaveLength(3);
    });

    it('persiste l état dans .akoris/state.json', () => {
      engine.transition('Draft', 'Planned');
      const statePath = `${testProjectPath}/.akoris/state.json`;
      expect(existsSync(statePath)).toBe(true);
      const state = JSON.parse(readFileSync(statePath, 'utf-8'));
      expect(state.current).toBe('Planned');
      expect(state.history).toHaveLength(1);
    });

    it('refuse si l état courant ne correspond pas', () => {
      engine.transition('Draft', 'Planned');
      const result = engine.transition('Draft', 'Planned');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Planned');
    });

    it('refuse une transition non définie', () => {
      const result = engine.transition('Draft', 'Released');
      expect(result.success).toBe(false);
    });
  });

  describe('getCurrentState avec état persistant', () => {
    it('retourne Planned après transition', () => {
      engine.transition('Draft', 'Planned');
      const current = engine.getCurrentState();
      expect(current).toBe('Planned');
    });
  });

  describe('getHistory', () => {
    it('retourne l historique après une transition', () => {
      engine.transition('Draft', 'Planned');
      const history = engine.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].state).toBe('Planned');
      expect(history[0].enteredAt).toBeTruthy();
      expect(history[0].exitedAt).toBeNull();
    });
  });

  describe('getAllTransitions', () => {
    it('retourne les 8 transitions', () => {
      const all = engine.getAllTransitions();
      expect(all).toHaveLength(8);
    });
  });
});
