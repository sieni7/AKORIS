import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { RegistryReaderV2 } from './registry-reader-v2.service.js';
import type { StateMachine } from '../types/index.js';

interface StateHistoryEntry {
  state: string;
  enteredAt: string;
  exitedAt: string | null;
}

interface ProjectState {
  current: string;
  history: StateHistoryEntry[];
}

export class StateMachineEngine {
  private reader: RegistryReaderV2;
  private projectPath: string;

  constructor(reader: RegistryReaderV2, projectPath?: string) {
    this.reader = reader;
    this.projectPath = projectPath || resolve(reader['basePath'] || process.cwd(), '..');
  }

  getMachine(): StateMachine | null {
    return this.reader.getStateMachine();
  }

  canTransition(from: string, to: string): { allowed: boolean; reason?: string } {
    const machine = this.getMachine();
    if (!machine) return { allowed: false, reason: 'Machine à états non trouvée (state-machine.json)' };

    const transition = machine.transitions.find(t => t.from === from && t.to === to);
    if (!transition) {
      const allowed = machine.transitions
        .filter(t => t.from === from)
        .map(t => t.to);
      const suggestion = allowed.length > 0
        ? ` Transitions possibles depuis "${from}" : ${allowed.join(', ')}`
        : ' Aucune transition possible depuis cet état.';
      return { allowed: false, reason: `Transition "${from} → ${to}" non définie dans la machine à états.${suggestion}` };
    }

    return { allowed: true };
  }

  getAvailableTransitions(from: string): Array<{ to: string; gates: string[]; authorizedBy: string; description?: string }> {
    const machine = this.getMachine();
    if (!machine) return [];

    return machine.transitions
      .filter(t => t.from === from)
      .map(t => ({
        to: t.to,
        gates: t.gates,
        authorizedBy: t.authorizedBy,
        description: t.description,
      }));
  }

  getRequiredGates(from: string, to: string): string[] {
    const machine = this.getMachine();
    if (!machine) return [];

    const transition = machine.transitions.find(t => t.from === from && t.to === to);
    return transition?.gates || [];
  }

  getAuthorizedAgent(from: string, to: string): string | null {
    const machine = this.getMachine();
    if (!machine) return null;

    const transition = machine.transitions.find(t => t.from === from && t.to === to);
    return transition?.authorizedBy || null;
  }

  getStates(): Array<{ id: string; description: string }> {
    const machine = this.getMachine();
    return machine?.states || [];
  }

  getInitialState(): string | null {
    const machine = this.getMachine();
    return machine?.initialState || null;
  }

  private getStatePath(): string {
    return join(this.projectPath, '.akoris', 'state.json');
  }

  readProjectState(): ProjectState | null {
    const statePath = this.getStatePath();
    if (!existsSync(statePath)) return null;
    return JSON.parse(readFileSync(statePath, 'utf-8'));
  }

  getCurrentState(): string {
    const state = this.readProjectState();
    if (state) return state.current;
    return this.getInitialState() || 'Draft';
  }

  getHistory(): StateHistoryEntry[] {
    const state = this.readProjectState();
    return state?.history || [];
  }

  transition(from: string, to: string): { success: boolean; message: string; gates: string[] } {
    const validation = this.canTransition(from, to);
    if (!validation.allowed) {
      return { success: false, message: validation.reason || 'Transition refusée', gates: [] };
    }

    const statePath = this.getStatePath();
    const stateDir = join(this.projectPath, '.akoris');
    if (!existsSync(stateDir)) mkdirSync(stateDir, { recursive: true });

    let projectState: ProjectState;
    if (existsSync(statePath)) {
      projectState = JSON.parse(readFileSync(statePath, 'utf-8'));
    } else {
      projectState = {
        current: this.getInitialState() || 'Draft',
        history: [],
      };
    }

    if (projectState.current !== from) {
      return {
        success: false,
        message: `État actuel du projet : "${projectState.current}". La transition "${from} → ${to}" ne peut pas démarrer depuis l'état courant.`,
        gates: [],
      };
    }

    const lastEntry = projectState.history[projectState.history.length - 1];
    if (lastEntry && lastEntry.state === from && lastEntry.exitedAt === null) {
      lastEntry.exitedAt = new Date().toISOString();
    }

    projectState.current = to;
    projectState.history.push({
      state: to,
      enteredAt: new Date().toISOString(),
      exitedAt: null,
    });

    writeFileSync(statePath, JSON.stringify(projectState, null, 2) + '\n');

    const gates = this.getRequiredGates(from, to);

    return {
      success: true,
      message: `Transition "${from} → ${to}" effectuée avec succès. Nouvel état : "${to}".`,
      gates,
    };
  }

  getAllTransitions(): Array<{ from: string; to: string; gates: string[]; authorizedBy: string; description?: string }> {
    const machine = this.getMachine();
    return machine?.transitions || [];
  }
}