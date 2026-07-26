import type { Agent } from './types.js';

export interface SearchQuery {
  q: string;
  type?: 'agent' | 'capability' | 'tag';
  limit?: number;
}

export interface SearchResult {
  agents: Agent[];
  count: number;
  query: string;
}

export class SearchEngine {
  private agents: Map<string, Agent>;

  constructor(agents: Map<string, Agent>) {
    this.agents = agents;
  }

  search(query: SearchQuery): SearchResult {
    const q = query.q.toLowerCase();
    let results = Array.from(this.agents.values());

    results = results.filter((agent) => {
      if (agent.name.toLowerCase().includes(q)) return true;
      if (agent.description.toLowerCase().includes(q)) return true;
      if (agent.domain.toLowerCase().includes(q)) return true;
      if (agent.tags.some((t) => t.toLowerCase().includes(q))) return true;
      if (agent.capabilities.some((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))) return true;
      return false;
    });

    if (query.type === 'agent') {
      results = results.filter((a) => a.name.toLowerCase().includes(q));
    } else if (query.type === 'capability') {
      results = results.filter((a) =>
        a.capabilities.some((c) => c.name.toLowerCase().includes(q)),
      );
    } else if (query.type === 'tag') {
      results = results.filter((a) => a.tags.some((t) => t.toLowerCase().includes(q)));
    }

    const limit = query.limit ?? 20;
    const sliced = results.slice(0, limit);

    return { agents: sliced, count: sliced.length, query: q };
  }
}
