import { z } from 'zod';

export const GateCriteriaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  evaluator: z.string(),
  weight: z.number().min(0).max(1),
  params: z.record(z.unknown()).optional(),
});

export const QualityGateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  severity: z.enum(['bloquante', 'critique', 'majeure', 'mineure']),
  owner: z.string().min(1),
  criteria: z.array(GateCriteriaSchema),
  threshold: z.number().min(0).max(1),
  controls: z.array(z.string()),
});
