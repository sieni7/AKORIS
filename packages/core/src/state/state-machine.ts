import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { StateMachine, TransitionHistory, ProjectState } from '@akoris/shared';

export class StateMachineEngine {
  private projectRoot: string;
  private machineCache: StateMachine | null = null;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Charge la machine à états depuis registry/state-machine.json.
   */
  async loadMachine(): Promise<StateMachine> {
    if (this.machineCache) return this.machineCache;
    const path = join(this.projectRoot, 'registry', 'state-machine.json');
    try {
      const content = await readFile(path, 'utf-8');
      const data = JSON.parse(content);
      if (!data.states || !data.transitions) {
        throw new Error('La machine à états est invalide (states ou transitions manquants)');
      }
      this.machineCache = data;
      return data;
    } catch (err: any) {
      throw new Error(`Impossible de charger la machine à états : ${err.message}`);
    }
  }

  /**
   * Récupère l'état courant du projet depuis .akoris/state.json.
   */
  async getCurrentState(): Promise<string> {
    const statePath = join(this.projectRoot, '.akoris', 'state.json');
    try {
      const content = await readFile(statePath, 'utf-8');
      const state = JSON.parse(content) as ProjectState;
      return state.currentState || 'DRAFT';
    } catch (_) {
      return 'DRAFT';
    }
  }

  /**
   * Récupère l'historique des transitions.
   */
  async getHistory(): Promise<TransitionHistory[]> {
    const statePath = join(this.projectRoot, '.akoris', 'state.json');
    try {
      const content = await readFile(statePath, 'utf-8');
      const state = JSON.parse(content) as ProjectState;
      return state.history || [];
    } catch (_) {
      return [];
    }
  }

  /**
   * Vérifie si une transition est autorisée (gates, autorisations).
   */
  async canTransition(from: string, to: string): Promise<{ allowed: boolean; requiredGates: string[]; authorizedBy: string[]; missingGates?: string[] }> {
    const machine = await this.loadMachine();
    const transition = machine.transitions.find(t => t.from === from && t.to === to);
    if (!transition) {
      return { allowed: false, requiredGates: [], authorizedBy: [], missingGates: [] };
    }

    // TODO: intégrer QualityEngine pour vérifier les gates
    const allPassed = true;

    if (!allPassed) {
      return {
        allowed: false,
        requiredGates: transition.requiredGates,
        authorizedBy: transition.authorizedBy,
        missingGates: [],
      };
    }

    return {
      allowed: true,
      requiredGates: transition.requiredGates,
      authorizedBy: transition.authorizedBy,
      missingGates: [],
    };
  }

  /**
   * Exécute une transition (si autorisée).
   */
  async transition(from: string, to: string, actor?: string): Promise<TransitionHistory> {
    const canResult = await this.canTransition(from, to);
    if (!canResult.allowed) {
      throw new Error(`Transition de ${from} vers ${to} non autorisée. Gates manquants : ${canResult.missingGates?.join(', ') || ''}`);
    }

    const statePath = join(this.projectRoot, '.akoris', 'state.json');
    let currentState: ProjectState;
    try {
      const content = await readFile(statePath, 'utf-8');
      currentState = JSON.parse(content) as ProjectState;
    } catch (_) {
      currentState = { currentState: 'DRAFT', history: [], lastTransition: null };
    }

    if (currentState.currentState !== from) {
      throw new Error(`L'état actuel est ${currentState.currentState}, impossible de transitionner depuis ${from}`);
    }

    const entry: TransitionHistory = {
      id: crypto.randomUUID(),
      from,
      to,
      at: new Date().toISOString(),
      authorizedBy: actor || 'system',
      gatesStatus: [],
    };

    currentState.currentState = to;
    currentState.history.push(entry);
    currentState.lastTransition = entry.at;

    await writeFile(statePath, JSON.stringify(currentState, null, 2), 'utf-8');
    return entry;
  }

  /**
   * Exporte un rapport d'état (Markdown, JSON, texte).
   */
  async exportReport(format: 'markdown' | 'json' | 'text'): Promise<string> {
    const machine = await this.loadMachine();
    const currentState = await this.getCurrentState();
    const history = await this.getHistory();

    if (format === 'json') {
      return JSON.stringify({ machine, currentState, history }, null, 2);
    }

    if (format === 'markdown') {
      let md = `# Rapport d'état du projet\n\n`;
      md += `- **État actuel** : ${currentState}\n`;
      md += `- **Nombre de transitions** : ${history.length}\n\n`;
      md += `## Historique\n\n`;
      if (history.length === 0) {
        md += `Aucune transition enregistrée.\n`;
      } else {
        for (const h of history.slice(-5)) {
          md += `- ${h.at} : ${h.from} → ${h.to} (${h.authorizedBy})\n`;
        }
      }
      return md;
    }

    return `État : ${currentState}\nTransitions : ${history.length}\nDernière transition : ${history.length > 0 ? history[history.length-1].at : 'aucune'}`;
  }
}
