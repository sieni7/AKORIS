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

describe('GET /search', () => {
  it('returns results for valid query', async () => {
    const res = await app.inject({ method: 'GET', url: '/search?q=orchestrator' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.count).toBeGreaterThan(0);
    expect(body.query).toBe('orchestrator');
  });

  it('returns empty for no match', async () => {
    const res = await app.inject({ method: 'GET', url: '/search?q=nonexistent' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).count).toBe(0);
  });

  it('returns 400 when q is missing', async () => {
    const res = await app.inject({ method: 'GET', url: '/search' });
    expect(res.statusCode).toBe(400);
  });
});
