import type { FastifyInstance } from 'fastify';
import type { CoreService } from '../services/core.service.js';

export default async function registryRoutes(fastify: FastifyInstance, _opts: unknown) {
  const core: CoreService = fastify.core;

  fastify.get('/registry/index', async () => core.registry.loadIndex());

  fastify.get('/registry/agents', async (request) => {
    const { domain, status, criticity, tag } = request.query as Record<string, string | undefined>;
    return core.registry.listAgents({ domain, status, criticity, tag });
  });

  fastify.get('/registry/agents/:id', async (request) => {
    const { id } = request.params as { id: string };
    return core.registry.loadAgent(id);
  });
}
