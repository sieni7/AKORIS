import { describe, it, expect } from 'vitest';
import { DoctorEngine } from '../src/doctor-engine.js';

describe('DoctorEngine', () => {
  it('should return issues list', () => {
    const doctor = new DoctorEngine();
    const issues = doctor.diagnose();
    expect(Array.isArray(issues)).toBe(true);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toHaveProperty('severity');
  });

  it('should fix issues', () => {
    const doctor = new DoctorEngine();
    const result = doctor.fix(['test-issue']);
    expect(result.fixed).toContain('test-issue');
  });
});
