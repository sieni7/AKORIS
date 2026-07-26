import type { FastifyInstance } from 'fastify';
import type { CoreService } from '../services/core.service.js';

export default async function doctorRoutes(fastify: FastifyInstance, _opts: unknown) {
  const core: CoreService = fastify.core;

  fastify.get('/doctor', async () => core.doctor.diagnose());

  fastify.post<{ Body: { issueIds?: string[] } }>('/doctor/fix', async (request) => {
    const { issueIds } = request.body;
    return core.doctor.fix(issueIds);
  });
}
