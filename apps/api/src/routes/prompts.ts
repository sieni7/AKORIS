import type { FastifyInstance } from 'fastify';
import type { CoreService } from '../services/core.service.js';

export default async function promptRoutes(fastify: FastifyInstance, _opts: unknown) {
  const core: CoreService = fastify.core;

  fastify.get('/prompts', async (request) => {
    const { search, tag } = request.query as { search?: string; tag?: string };
    return { success: true, data: core.prompts.listTemplates({ search, tag }) };
  });

  fastify.get('/prompts/:id', async (request) => {
    const { id } = request.params as { id: string };
    return { success: true, data: core.prompts.getTemplate(id) };
  });

  fastify.post('/prompts', async (request) => {
    const { name, description, template, tags } = request.body as {
      name: string; description?: string; template: string; tags?: string[];
    };
    const result = core.prompts.createTemplate(name, description ?? '', template, tags ?? []);
    return { success: true, data: result };
  });

  fastify.put('/prompts/:id', async (request) => {
    const { id } = request.params as { id: string };
    const body = request.body as Record<string, unknown>;
    const result = core.prompts.updateTemplate(id, body);
    return { success: true, data: result };
  });

  fastify.delete('/prompts/:id', async (request) => {
    const { id } = request.params as { id: string };
    core.prompts.deleteTemplate(id);
    return { success: true };
  });

  fastify.post('/prompts/:id/resolve', async (request) => {
    const { id } = request.params as { id: string };
    const { agentId } = (request.body ?? {}) as { agentId?: string };
    const result = core.prompts.resolveTemplate(id, { agentId });
    return { success: true, data: result };
  });

  fastify.post('/prompts/evaluate', async (request) => {
    const { prompt, model, temperature, maxTokens } = request.body as {
      prompt: string; model?: string; temperature?: number; maxTokens?: number;
    };
    const result = await core.prompts.evaluate({ prompt, model, temperature, maxTokens });
    return { success: true, data: result };
  });
}
