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
  requiredGates: z.array(z.string()),
  authorizedBy: z.array(z.string()),
  description: z.string(),
});

export const StateMachineSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  states: z.array(StateSchema),
  transitions: z.array(TransitionSchema),
});

export const TransitionHistorySchema = z.object({
  id: z.string().uuid(),
  from: z.string(),
  to: z.string(),
  at: z.string().datetime(),
  authorizedBy: z.string(),
  comment: z.string().optional(),
});

export const CurrentStateSchema = z.object({
  currentState: z.string(),
});

export const TransitionRequestSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  comment: z.string().optional(),
});

export const TransitionResponseSchema = z.object({
  success: z.boolean(),
  newState: z.string(),
  history: TransitionHistorySchema,
  gatesStatus: z.array(z.object({
    gateId: z.string(),
    status: z.enum(['PASS', 'FAIL', 'PENDING', 'SKIPPED']),
    details: z.string().optional(),
  })),
});

export type State = z.infer<typeof StateSchema>;
export type Transition = z.infer<typeof TransitionSchema>;
export type StateMachine = z.infer<typeof StateMachineSchema>;
export type TransitionHistory = z.infer<typeof TransitionHistorySchema>;
export type TransitionRequest = z.infer<typeof TransitionRequestSchema>;
export type TransitionResponse = z.infer<typeof TransitionResponseSchema>;
