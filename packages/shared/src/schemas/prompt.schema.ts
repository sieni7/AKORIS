import { z } from 'zod';

export const PromptContextSchema = z.object({
  includeRegistry: z.boolean(),
  includeADR: z.boolean(),
  includeState: z.boolean(),
  includeLogs: z.boolean(),
  includeStandards: z.boolean(),
  includeArchitecture: z.boolean(),
  includeSprint: z.boolean(),
  custom: z.record(z.unknown()).optional(),
});

export const PromptSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  template: z.string(),
  agentId: z.string().min(1),
  context: PromptContextSchema,
  variables: z.record(z.string()),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.number().int().nonnegative(),
    llmProvider: z.string().optional(),
    tokens: z.number().int().nonnegative().optional(),
  }),
});
