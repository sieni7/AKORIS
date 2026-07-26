import { HttpClient } from './transport/http';

export interface SDKConfig {
  baseUrl: string;
  token?: string;
  fetch?: typeof globalThis.fetch;
}

export interface AgentFilter {
  domain?: string;
  status?: string;
  criticity?: string;
  tag?: string;
}

export interface SearchOptions {
  type?: 'agent' | 'capability' | 'tag';
  limit?: number;
}

export interface LogFilter {
  lines?: number;
  agent?: string;
  level?: string;
  since?: string;
}

export interface TransitionRequest {
  from: string;
  to: string;
  comment?: string;
}

export class AKORISClient {
  private http: HttpClient;

  constructor(config: SDKConfig) {
    this.http = new HttpClient({
      baseUrl: config.baseUrl,
      fetch: config.fetch,
      headers: config.token ? { Authorization: `Bearer ${config.token}` } : {},
    });
  }

  getHealth() {
    return this.http.request<{ status: 'ok'; version: string; timestamp: string }>('/health');
  }

  getStateMachine() {
    return this.http.request<{ version: string; states: unknown[]; transitions: unknown[] }>('/state/machine');
  }

  getCurrentState() {
    return this.http.request<{ currentState: string }>('/state/current');
  }

  getStateHistory() {
    return this.http.request<unknown[]>('/state/history');
  }

  getRegistryIndex() {
    return this.http.request<{ version: string; agentCount: number; domains: string[]; lastUpdated: string }>('/registry/index');
  }

  listAgents(filter?: AgentFilter) {
    const params = new URLSearchParams();
    if (filter?.domain) params.set('domain', filter.domain);
    if (filter?.status) params.set('status', filter.status);
    if (filter?.criticity) params.set('criticity', filter.criticity);
    if (filter?.tag) params.set('tag', filter.tag);
    const qs = params.toString();
    return this.http.request<{ agents: unknown[]; count: number }>(`/registry/agents${qs ? `?${qs}` : ''}`);
  }

  getAgent(id: string) {
    return this.http.request<unknown>(`/registry/agents/${encodeURIComponent(id)}`);
  }

  search(q: string, options?: SearchOptions) {
    const params = new URLSearchParams({ q });
    if (options?.type) params.set('type', options.type);
    if (options?.limit) params.set('limit', String(options.limit));
    return this.http.request<{ agents: unknown[]; count: number; query: string }>(`/search?${params}`);
  }

  getLogs(filter?: LogFilter) {
    const params = new URLSearchParams();
    if (filter?.lines) params.set('lines', String(filter.lines));
    if (filter?.agent) params.set('agent', filter.agent);
    if (filter?.level) params.set('level', filter.level);
    if (filter?.since) params.set('since', filter.since);
    const qs = params.toString();
    return this.http.request<unknown[]>(`/logs${qs ? `?${qs}` : ''}`);
  }

  diagnose() {
    return this.http.request<unknown[]>('/doctor');
  }

  transition(request: TransitionRequest) {
    return this.http.request<{ success: boolean; newState: string }>('/state/transition', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  fix(issueIds?: string[]) {
    return this.http.request<{ fixed: string[]; failed: string[] }>('/doctor/fix', {
      method: 'POST',
      body: issueIds ? JSON.stringify({ issueIds }) : undefined,
    });
  }
}
