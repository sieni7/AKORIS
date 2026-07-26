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

describe('GET /logs', () => {
  it('returns logs array', async () => {
    const res = await app.inject({ method: 'GET', url: '/logs' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBeGreaterThan(0);
  });

  it('filters by agent', async () => {
    const res = await app.inject({ method: 'GET', url: '/logs?agent=agent-orchestrator' });
    const body = JSON.parse(res.body);
    expect(body.every((l: { agent: string }) => l.agent === 'agent-orchestrator')).toBe(true);
  });

  it('filters by level', async () => {
    const res = await app.inject({ method: 'GET', url: '/logs?level=error' });
    const body = JSON.parse(res.body);
    expect(body.every((l: { level: string }) => l.level === 'error')).toBe(true);
  });
});
