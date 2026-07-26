import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

export default fp(async function openapiPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'AKORIS Control Center API',
        description: 'REST API for AKORIS project orchestration',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3000', description: 'Development server' }],
      components: {
        schemas: {
          ErrorResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean', enum: [false] },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                    suggestion: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
});
