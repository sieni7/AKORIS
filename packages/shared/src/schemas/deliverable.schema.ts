import { z } from 'zod';

export const DeliverableSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['documentation', 'code', 'configuration', 'rapport', 'plan', 'specification', 'audit']),
  description: z.string(),
  mandatory: z.boolean(),
  producedBy: z.array(z.string()),
  consumedBy: z.array(z.string()),
  qualityGates: z.array(z.string()),
});
