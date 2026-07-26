import type { FastifyInstance } from 'fastify';
import type { CoreService } from '../services/core.service.js';

export default async function stateRoutes(fastify: FastifyInstance, _opts: unknown) {
  const core: CoreService = fastify.core;

  fastify.get('/state/machine', async () => core.stateMachine.loadMachine());
  fastify.get('/state/current', async () => core.stateMachine.getCurrentState());
  fastify.get('/state/history', async () => core.stateMachine.getHistory());

  fastify.post<{ Body: { from: string; to: string; comment?: string } }>('/state/transition', async (request) => {
    const { from, to, comment } = request.body;
    return core.stateMachine.transition(from, to, 'user', comment);
  });
}
