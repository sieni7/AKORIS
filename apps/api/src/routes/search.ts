import type { FastifyInstance } from 'fastify';
import type { CoreService } from '../services/core.service.js';

export default async function searchRoutes(fastify: FastifyInstance, _opts: unknown) {
  const core: CoreService = fastify.core;

  fastify.get('/search', async (request) => {
    const { q, type, limit } = request.query as { q?: string; type?: 'agent' | 'capability' | 'tag'; limit?: string };
    if (!q) {
      throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'Query parameter "q" is required' };
    }
    return core.searchEngine.search({ q, type, limit: limit ? parseInt(limit, 10) : undefined });
  });
}
