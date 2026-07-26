import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  errors: z.array(z.object({
    code: z.string(),
    message: z.string(),
    suggestion: z.string().optional(),
    details: z.record(z.unknown()).optional(),
  })),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
