import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const ERROR_STATUS_MAP: Record<string, number> = {
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  TRANSITION_ERROR: 409,
  INTERNAL_ERROR: 500,
};

export default fp(async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: Error & { statusCode?: number; code?: string; validation?: unknown }, _request: FastifyRequest, reply: FastifyReply) => {
    const code = error.code ?? 'INTERNAL_ERROR';
    const statusCode = error.statusCode ?? ERROR_STATUS_MAP[code] ?? 500;

    reply.status(statusCode).send({
      success: false,
      errors: [
        {
          code,
          message: error.message ?? 'An unexpected error occurred',
          suggestion: statusCode === 500 ? 'Please try again later or contact support.' : undefined,
          details: error.validation ? { validation: error.validation } : undefined,
        },
      ],
    });
  });
});
