import { RegistryReader } from '../registry/registry-reader.js';
import type { SearchResult, SearchFilters } from '../types/index.js';

export class SearchEngine {
  private registryReader: RegistryReader;

  constructor(projectRoot: string) {
    this.registryReader = new RegistryReader(projectRoot);
  }

  /**
   * Recherche simple dans le Registry.
   */
  async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    const agents = await this.registryReader.listAgents();
    for (const agent of agents) {
      if (filters?.type && filters.type !== 'agent') continue;
      const score = this.scoreString(agent.id, query) || this.scoreString(agent.name, query) || this.scoreString(agent.description, query);
      if (score > 0) {
        results.push({
          type: 'agent',
          id: agent.id,
          score,
          preview: `${agent.name} — ${agent.domain}`,
          data: agent,
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 50);
  }

  private scoreString(field: string, query: string): number {
    if (!field) return 0;
    const lowerField = field.toLowerCase();
    const lowerQuery = query.toLowerCase();
    if (lowerField === lowerQuery) return 100;
    if (lowerField.includes(lowerQuery)) return 50;
    if (lowerQuery.split(' ').every(word => lowerField.includes(word))) return 30;
    return 0;
  }
}
