import { z } from 'zod';

export const AgentDependencySchema = z.object({
  agentId: z.string().min(1),
  type: z.enum(['mandatory', 'optional']),
  description: z.string().optional(),
});

export const CapabilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  agentId: z.string().min(1),
  type: z.enum(['can', 'cannot']),
});

export const AgentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  domain: z.string().min(1),
  criticity: z.enum(['critique', 'haute', 'moyenne', 'basse']),
  status: z.enum(['active', 'inactive', 'deprecated', 'draft']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string(),
  tags: z.array(z.string()),
  dependencies: z.array(AgentDependencySchema),
  tokenEstimate: z.number().optional(),
  activatedBy: z.array(z.string()).optional(),
  produces: z.array(z.string()).optional(),
  validates: z.array(z.string()).optional(),
  capabilities: z.array(CapabilitySchema),
});
