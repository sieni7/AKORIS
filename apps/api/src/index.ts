import Fastify from 'fastify';
import corsPlugin from './plugins/cors.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import openapiPlugin from './plugins/openapi.js';
import healthRoutes from './routes/health.js';
import stateRoutes from './routes/state.js';
import registryRoutes from './routes/registry.js';
import searchRoutes from './routes/search.js';
import logsRoutes from './routes/logs.js';
import doctorRoutes from './routes/doctor.js';
import { createCoreService } from './services/core.service.js';
import './types/index.js';

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    },
  });

  fastify.decorate('core', createCoreService());

  await fastify.register(corsPlugin);
  await fastify.register(errorHandlerPlugin);
  await fastify.register(openapiPlugin);

  await fastify.register(healthRoutes);
  await fastify.register(stateRoutes);
  await fastify.register(registryRoutes);
  await fastify.register(searchRoutes);
  await fastify.register(logsRoutes);
  await fastify.register(doctorRoutes);

  return fastify;
}
