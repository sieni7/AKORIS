import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/index.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('GET /registry', () => {
  it('/registry/index returns index', async () => {
    const res = await app.inject({ method: 'GET', url: '/registry/index' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.agentCount).toBeGreaterThan(0);
    expect(body.domains).toContain('CORE');
  });

  it('/registry/agents lists agents', async () => {
    const res = await app.inject({ method: 'GET', url: '/registry/agents' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.agents).toBeInstanceOf(Array);
    expect(body.count).toBeGreaterThan(0);
  });

  it('/registry/agents?domain=QA filters by domain', async () => {
    const res = await app.inject({ method: 'GET', url: '/registry/agents?domain=QA' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.agents.every((a: { domain: string }) => a.domain === 'QA')).toBe(true);
  });

  it('/registry/agents/:id returns agent details', async () => {
    const res = await app.inject({ method: 'GET', url: '/registry/agents/agent-orchestrator' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).name).toBe('Orchestrator');
  });

  it('/registry/agents/:id returns 404 for unknown', async () => {
    const res = await app.inject({ method: 'GET', url: '/registry/agents/unknown' });
    expect(res.statusCode).toBe(404);
  });
});
