import { z } from 'zod';

export const LogEntrySchema = z.object({
  timestamp: z.string(),
  agentId: z.string().min(1),
  action: z.string().min(1),
  details: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export const LogFilterSchema = z.object({
  agent: z.string().optional(),
  since: z.string().optional(),
  lines: z.number().int().positive().optional(),
});
