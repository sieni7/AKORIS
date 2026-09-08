import type {
  Agent,
  AgentDependency,
  AgentFilter,
  Capability,
  RegistryIndex,
  ValidationIssue,
} from '../types.js';
import { NotFoundError } from '../errors.js';

/**
 * RegistryReader — lecture du Registry en mémoire (§5.1 Core Engine spec).
 *
 * Le constructeur reçoit une collection d'agents (source de vérité injectée).
 * `agentCount` de `loadIndex()` est TOUJOURS dérivé de la collection — jamais
 * une valeur déclarative non vérifiée (§4.9).
 *
 * Invariant : ce moteur lit une collection fournie (qui DOIT provenir du
 * Registry réel en production ; les fixtures de test ne sont jamais utilisées
 * comme source de vérité).
 */
export class RegistryReader {
  private readonly agents: Map<string, Agent>;

  constructor(agents: Agent[]) {
    this.agents = new Map();
    for (const agent of agents) {
      this.agents.set(agent.id, agent);
    }
  }

  get count(): number {
    return this.agents.size;
  }

  loadIndex(): RegistryIndex {
    const domains = [...new Set([...this.agents.values()].map((a) => a.domain))].sort();
    return {
      version: '0.2.0',
      agentCount: this.agents.size,
      domains,
      lastUpdated: new Date().toISOString(),
    };
  }

  listAgents(filter?: AgentFilter): { agents: Agent[]; count: number } {
    let agents = [...this.agents.values()];
    if (filter) {
      if (filter.domain) {
        agents = agents.filter((a) => a.domain === filter.domain);
      }
      if (filter.status) {
        agents = agents.filter((a) => a.status === filter.status);
      }
      if (filter.criticity) {
        agents = agents.filter((a) => a.criticity === filter.criticity);
      }
      if (filter.tag) {
        // Agent n'expose pas de champ `tags` (§4.1) : le filtre `tag` correspond
        // à une égalité sur les responsabilités (interprétation documentée).
        agents = agents.filter((a) => a.responsibilities.includes(filter.tag as Agent['responsibilities'][number]));
      }
    }
    return { agents, count: agents.length };
  }

  loadAgent(id: string): Agent {
    const agent = this.agents.get(id);
    if (!agent) {
      throw new NotFoundError('Agent', id);
    }
    return agent;
  }

  getDependencies(id: string): AgentDependency[] {
    return this.loadAgent(id).dependencies;
  }

  getCapabilities(id: string): Capability[] {
    return this.loadAgent(id).capabilities;
  }

  /**
   * Validation des dépendances (§5.1) : cycles, dépendances mandatory absentes,
   * référence vers un agent non actif. Les références optional absentes sont
   * signalées en warning, les mandatory en error.
   */
  validateDependencies(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const agent of this.agents.values()) {
      for (let i = 0; i < agent.dependencies.length; i++) {
        const dep = agent.dependencies[i];
        const target = this.agents.get(dep.agentId);
        let severity: ValidationIssue['severity'] = 'warning';

        if (!target) {
          severity = dep.type === 'mandatory' ? 'error' : 'warning';
          issues.push({
            id: `${agent.id}-dep-${i}`,
            severity,
            category: 'missing-dependency',
            agentId: agent.id,
            relatedAgentId: dep.agentId,
            message: `Dépendance ${dep.type} '${dep.agentId}' absente du registre`,
          });
          continue;
        }

        if (target.status !== 'active') {
          severity = dep.type === 'mandatory' ? 'error' : 'warning';
          issues.push({
            id: `${agent.id}-dep-${i}`,
            severity,
            category: 'inactive-reference',
            agentId: agent.id,
            relatedAgentId: dep.agentId,
            message: `Dépendance vers agent non actif '${dep.agentId}' (statut: ${target.status})`,
          });
        }
      }
    }

    // Détection de cycles (DFS à 3 couleurs sur les dépendances présentes).
    const WHITE = 0;
    const GRAY = 1;
    const BLACK = 2;
    const color = new Map<string, number>();
    for (const id of this.agents.keys()) color.set(id, WHITE);
    const stack: string[] = [];

    const visit = (id: string): void => {
      color.set(id, GRAY);
      stack.push(id);
      const agent = this.agents.get(id)!;
      for (const dep of agent.dependencies) {
        const target = this.agents.get(dep.agentId);
        if (!target) continue;
        const c = color.get(dep.agentId)!;
        if (c === WHITE) {
          visit(dep.agentId);
        } else if (c === GRAY) {
          const startIdx = stack.indexOf(dep.agentId);
          if (startIdx !== -1) {
            const cycle = [...stack.slice(startIdx), dep.agentId];
            issues.push({
              id: `cycle-${cycle.join('->')}`,
              severity: 'error',
              category: 'cycle',
              agentId: dep.agentId,
              message: `Cycle de dépendances détecté : ${cycle.join(' -> ')}`,
            });
          }
        }
      }
      stack.pop();
      color.set(id, BLACK);
    };

    for (const id of this.agents.keys()) {
      if (color.get(id) === WHITE) {
        visit(id);
      }
    }

    return issues;
  }
}