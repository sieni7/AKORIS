import { z } from 'zod';

export const CapabilitySchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  description: z.string(),
  agentId: z.string(),
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
  dependencies: z.array(z.object({
    agentId: z.string(),
    type: z.enum(['mandatory', 'optional']),
    description: z.string().optional(),
  })),
  capabilities: z.array(CapabilitySchema),
});

export const AgentListResponseSchema = z.object({
  agents: z.array(AgentSchema),
  count: z.number(),
});

export type Agent = z.infer<typeof AgentSchema>;
