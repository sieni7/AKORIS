import { describe, it, expect, beforeEach } from 'vitest';
import { AKORISClient } from '../src/client.js';

function mockFetch(data: unknown, status = 200) {
  return async (_url: string, _opts?: RequestInit) => {
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 404 ? 'Not Found' : 'OK',
      text: async () => JSON.stringify(data),
    } as Response;
  };
}

describe('AKORISClient', () => {
  let client: AKORISClient;

  beforeEach(() => {
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch({ status: 'ok', version: '1.0.0', timestamp: '2024-01-01T00:00:00.000Z' }) });
  });

  it('getHealth returns health response', async () => {
    const result = await client.getHealth();
    expect(result.status).toBe('ok');
    expect(result.version).toBe('1.0.0');
  });

  it('getStateMachine returns machine', async () => {
    const machine = { version: '1.0.0', states: [], transitions: [] };
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch(machine) });
    const result = await client.getStateMachine();
    expect(result.states).toEqual([]);
  });

  it('getCurrentState returns state', async () => {
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch({ currentState: 'draft' }) });
    const result = await client.getCurrentState();
    expect(result.currentState).toBe('draft');
  });

  it('listAgents returns agents list', async () => {
    const response = { agents: [{ id: 'a1', name: 'Agent 1' }], count: 1 };
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch(response) });
    const result = await client.listAgents({ domain: 'CORE' });
    expect(result.count).toBe(1);
    expect(result.agents[0].id).toBe('a1');
  });

  it('getAgent returns agent details', async () => {
    const agent = { id: 'test-id', name: 'Test Agent' };
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch(agent) });
    const result = await client.getAgent('test-id');
    expect((result as { id: string }).id).toBe('test-id');
  });

  it('search returns results', async () => {
    const response = { agents: [{ id: 'a1' }], count: 1, query: 'test' };
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch(response) });
    const result = await client.search('test');
    expect(result.count).toBe(1);
  });

  it('getLogs returns logs', async () => {
    const logs = [{ id: '1', level: 'info', message: 'test' }];
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch(logs) });
    const result = await client.getLogs();
    expect(result).toHaveLength(1);
  });

  it('diagnose returns issues', async () => {
    const issues = [{ id: 'i1', severity: 'low', message: 'ok' }];
    client = new AKORISClient({ baseUrl: 'http://localhost:3000', fetch: mockFetch(issues) });
    const result = await client.diagnose();
    expect(result).toHaveLength(1);
  });
});
