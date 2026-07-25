import { RegistryReaderV2 } from './registry-reader-v2.service.js';
import type { CapabilityRegistry } from '../types/index.js';

export class CapabilityResolver {
  private reader: RegistryReaderV2;

  constructor(reader: RegistryReaderV2) {
    this.reader = reader;
  }

  getRegistry(): CapabilityRegistry | null {
    return this.reader.getCapabilityRegistry();
  }

  findAgents(capability: string): string[] {
    const registry = this.getRegistry();
    if (!registry) return [];

    const matched = registry.capabilities[capability];
    if (matched) return matched;

    const normalized = capability.toLowerCase().replace(/[\s-]+/g, '_');
    for (const [key, agents] of Object.entries(registry.capabilities)) {
      if (key.toLowerCase() === normalized) return agents;
    }

    const partial: string[] = [];
    for (const agents of Object.values(registry.capabilities)) {
      for (const agent of agents) {
        if (!partial.includes(agent)) partial.push(agent);
      }
    }
    return [];
  }

  getCapabilities(agentId: string): string[] {
    const registry = this.getRegistry();
    if (!registry) return [];

    const result: string[] = [];
    for (const [capability, agents] of Object.entries(registry.capabilities)) {
      if (agents.includes(agentId)) result.push(capability);
    }
    return result;
  }

  findTeam(tasks: string[]): Map<string, string[]> {
    const assignment = new Map<string, string[]>();

    for (const task of tasks) {
      const agents = this.findAgents(task);
      for (const agent of agents) {
        const existing = assignment.get(agent) || [];
        existing.push(task);
        assignment.set(agent, existing);
      }
    }

    return assignment;
  }

  gapAnalysis(task: string): { covered: string[]; missing: string[]; suggestions: string[] } {
    const registry = this.getRegistry();
    const covered: string[] = [];
    const suggestions: string[] = [];

    if (!registry) {
      return { covered: [], missing: [task], suggestions: ['Registry des capacités non trouvé'] };
    }

    const directMatch = registry.capabilities[task];
    if (directMatch) {
      for (const agent of directMatch) covered.push(agent);
      return { covered, missing: [], suggestions: [] };
    }

    const normalized = task.toLowerCase().replace(/[\s-]+/g, '_');
    for (const [capability, agents] of Object.entries(registry.capabilities)) {
      if (capability.includes(normalized) || normalized.includes(capability)) {
        for (const agent of agents) {
          if (!covered.includes(agent)) covered.push(agent);
        }
        suggestions.push(capability);
      }
    }

    if (covered.length === 0) {
      const allCaps = Object.keys(registry.capabilities);
      suggestions.push(...allCaps.slice(0, 5));
    }

    return {
      covered,
      missing: covered.length === 0 ? [task] : [],
      suggestions,
    };
  }

  getAllCapabilities(): string[] {
    const registry = this.getRegistry();
    return registry ? Object.keys(registry.capabilities) : [];
  }

  getTotalCapabilities(): number {
    return this.getAllCapabilities().length;
  }

  searchCapabilities(query: string): Array<{ capability: string; agents: string[] }> {
    const registry = this.getRegistry();
    if (!registry) return [];

    const q = query.toLowerCase();
    return Object.entries(registry.capabilities)
      .filter(([key]) => key.toLowerCase().includes(q))
      .map(([capability, agents]) => ({ capability, agents }));
  }
}