import { z } from 'zod';

export const PromptVariableDefSchema = z.object({
  key: z.string(),
  label: z.string(),
  source: z.enum(['agent', 'state', 'logs', 'system']),
  required: z.boolean().optional(),
  defaultValue: z.string().optional(),
});

export const PromptTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
  template: z.string().min(1),
  variables: z.array(PromptVariableDefSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreatePromptSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().default(''),
  template: z.string().min(1, 'Template content is required'),
  tags: z.array(z.string()).default([]),
});

export const UpdatePromptSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  template: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
});

export const ResolvePromptSchema = z.object({
  agentId: z.string().optional(),
});

export const LLMRequestSchema = z.object({
  prompt: z.string().min(1),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
});

export const LLMResponseSchema = z.object({
  content: z.string(),
  model: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
  cost: z.number(),
  latencyMs: z.number(),
  timestamp: z.string().datetime(),
});

export const ResolvedPromptSchema = z.object({
  templateId: z.string(),
  templateName: z.string(),
  original: z.string(),
  resolved: z.string(),
  variables: z.record(z.string()),
  tokenEstimate: z.number(),
});

export const PromptListFilterSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
});

export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;
export type CreatePrompt = z.infer<typeof CreatePromptSchema>;
export type UpdatePrompt = z.infer<typeof UpdatePromptSchema>;
export type ResolvePrompt = z.infer<typeof ResolvePromptSchema>;
export type LLMRequest = z.infer<typeof LLMRequestSchema>;
export type LLMResponse = z.infer<typeof LLMResponseSchema>;
export type ResolvedPrompt = z.infer<typeof ResolvedPromptSchema>;
export type PromptListFilter = z.infer<typeof PromptListFilterSchema>;
