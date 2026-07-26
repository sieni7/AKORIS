import type { CoreService } from '../services/core.service.js';

declare module 'fastify' {
  interface FastifyInstance {
    core: CoreService;
  }
}
