import type { Agent } from './types.js';
import { NotFoundError } from './errors.js';

export interface RegistryIndex {
  version: string;
  agentCount: number;
  domains: string[];
  lastUpdated: string;
}

export interface AgentFilter {
  domain?: string;
  status?: string;
  criticity?: string;
  tag?: string;
}

export class RegistryReader {
  private agents: Map<string, Agent> = new Map();
  private lastUpdated: string = new Date().toISOString();

  constructor(seedAgents?: Agent[]) {
    if (seedAgents) {
      for (const agent of seedAgents) {
        this.agents.set(agent.id, agent);
      }
    }
  }

  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    this.lastUpdated = new Date().toISOString();
  }

  loadIndex(): RegistryIndex {
    const domains = new Set<string>();
    for (const agent of this.agents.values()) {
      domains.add(agent.domain);
    }
    return {
      version: '1.0.0',
      agentCount: this.agents.size,
      domains: Array.from(domains).sort(),
      lastUpdated: this.lastUpdated,
    };
  }

  listAgents(filter?: AgentFilter): { agents: Agent[]; count: number } {
    let result = Array.from(this.agents.values());

    if (filter?.domain) {
      result = result.filter((a) => a.domain === filter.domain);
    }
    if (filter?.status) {
      result = result.filter((a) => a.status === filter.status);
    }
    if (filter?.criticity) {
      result = result.filter((a) => a.criticity === filter.criticity);
    }
    if (filter?.tag) {
      result = result.filter((a) => a.tags.includes(filter.tag!));
    }

    return { agents: result, count: result.length };
  }

  loadAgent(id: string): Agent {
    const agent = this.agents.get(id);
    if (!agent) throw new NotFoundError('Agent', id);
    return agent;
  }
}
