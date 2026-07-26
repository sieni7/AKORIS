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

describe('GET /state', () => {
  it('/state/machine returns state machine', async () => {
    const res = await app.inject({ method: 'GET', url: '/state/machine' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.states).toBeInstanceOf(Array);
    expect(body.transitions).toBeInstanceOf(Array);
  });

  it('/state/current returns current state', async () => {
    const res = await app.inject({ method: 'GET', url: '/state/current' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).currentState).toBeDefined();
  });

  it('/state/history returns array', async () => {
    const res = await app.inject({ method: 'GET', url: '/state/history' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toBeInstanceOf(Array);
  });
});
