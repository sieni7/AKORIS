import { z } from 'zod';

export const SecretSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  provider: z.string().min(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
