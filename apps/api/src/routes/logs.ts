import type { FastifyInstance } from 'fastify';
import type { CoreService } from '../services/core.service.js';

export default async function logsRoutes(fastify: FastifyInstance, _opts: unknown) {
  const core: CoreService = fastify.core;

  fastify.get('/logs', async (request) => {
    const { lines, agent, level, since } = request.query as Record<string, string | undefined>;
    return core.logReader.readLogs({
      lines: lines ? parseInt(lines, 10) : undefined,
      agent,
      level,
      since,
    });
  });
}
