import { describe, it, expect } from 'vitest';
import { HealthResponseSchema } from '../src/index.js';

describe('HealthResponseSchema', () => {
  it('should validate a correct health response', () => {
    const result = HealthResponseSchema.safeParse({ status: 'ok', version: '1.0.0', timestamp: '2024-01-01T00:00:00.000Z' });
    expect(result.success).toBe(true);
  });
});
