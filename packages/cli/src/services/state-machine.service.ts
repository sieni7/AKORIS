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

  private getProjectName(): string {
    try {
      const manifestPath = join(this.projectPath, 'MANIFEST.json');
      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        return manifest.name || 'Projet AKORIS';
      }
    } catch {
    }
    return 'Projet AKORIS';
  }

  exportReport(format: 'markdown' | 'json' | 'text' = 'text'): string {
    const currentState = this.getCurrentState();
    const machine = this.getMachine();
    const history = this.getHistory();
    const available = this.getAvailableTransitions(currentState);
    const allStates = this.getStates();
    const projectName = this.getProjectName();

    const data = {
      project: projectName,
      date: new Date().toISOString(),
      version: machine?.version || '1.0.0',
      currentState,
      states: allStates,
      transitions: this.getAllTransitions(),
      history,
      availableTransitions: available,
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    if (format === 'markdown') {
      let md = `# Rapport d'état — ${projectName}\n\n`;
      md += `**Date** : ${new Date().toLocaleString('fr-FR')}\n\n`;
      md += `## État actuel\n\n**${currentState}**\n\n`;

      md += `## Historique des transitions\n\n`;
      if (history.length === 0) {
        md += `Aucune transition enregistrée.\n\n`;
      } else {
        md += `| État | Entré | Sorti |\n|------|-------|-------|\n`;
        for (const h of history) {
          const entered = new Date(h.enteredAt).toLocaleString('fr-FR');
          const exited = h.exitedAt ? new Date(h.exitedAt).toLocaleString('fr-FR') : 'en cours';
          md += `| ${h.state} | ${entered} | ${exited} |\n`;
        }
        md += `\n`;
      }

      md += `## Transitions possibles\n\n`;
      if (available.length === 0) {
        md += `Aucune transition disponible depuis **${currentState}**.\n\n`;
      } else {
        md += `| Vers | Gates requis | Autorisation |\n|------|--------------|--------------|\n`;
        for (const t of available) {
          md += `| ${t.to} | ${t.gates.join(', ') || '-'} | ${t.authorizedBy} |\n`;
        }
        md += `\n`;
      }

      md += `## États définis\n\n`;
      for (const s of allStates) {
        const marker = s.id === currentState ? ' ◀ courant' : '';
        md += `- **${s.id}**${marker} : ${s.description}\n`;
      }
      md += `\n`;

      md += `---\n*Rapport généré par AKORIS CLI*\n`;
      return md;
    }

    let txt = `État du projet : ${currentState}\n`;
    txt += `Date : ${new Date().toLocaleString('fr-FR')}\n`;
    txt += `Transitions possibles : ${available.map(t => t.to).join(', ') || 'aucune'}\n`;
    txt += `Historique : ${history.length} transition(s)\n`;
    return txt;
  }
}