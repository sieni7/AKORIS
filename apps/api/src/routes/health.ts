import type { FastifyInstance } from 'fastify';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return {
      status: 'ok' as const,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  });
}
