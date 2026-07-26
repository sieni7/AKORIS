import { z } from 'zod';

export const StateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  phase: z.string(),
  description: z.string(),
});

export const TransitionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  requiredGates: z.array(z.string()).optional(),
  authorizedBy: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const TransitionRequestSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  comment: z.string().optional(),
});
