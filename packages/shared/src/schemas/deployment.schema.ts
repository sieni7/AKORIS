import { z } from 'zod';

export const EnvironmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['staging', 'production', 'development']),
  url: z.string().url(),
  status: z.enum(['idle', 'deploying', 'deployed', 'failed']),
  lastDeployedAt: z.string().optional(),
});

export const DeploymentSchema = z.object({
  id: z.string(),
  environment: z.string().min(1),
  version: z.string(),
  status: z.enum(['pending', 'running', 'success', 'failed']),
  startedAt: z.string(),
  finishedAt: z.string().optional(),
  logs: z.array(z.string()),
  triggeredBy: z.string(),
});
