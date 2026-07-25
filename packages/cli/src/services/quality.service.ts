import { RegistryService } from './registry.service.js';
import { ValidatorService } from './validator.service.js';
import type { CheckResult } from '../types/index.js';

export class QualityService {
  private registry: RegistryService;
  private validator: ValidatorService;

  constructor() {
    this.registry = new RegistryService();
    this.validator = new ValidatorService(this.registry);
  }

  async runAllChecks(): Promise<{
    overall: 'passed' | 'failed';
    gates: CheckResult[];
    summary: { passed: number; failed: number; total: number };
  }> {
    const gates = await this.validator.checkQualityGates();
    const passed = gates.filter(g => g.passed).length;
    const failed = gates.filter(g => !g.passed).length;

    return {
      overall: failed === 0 ? 'passed' : 'failed',
      gates,
      summary: { passed, failed, total: gates.length },
    };
  }

  getGateDefinitions() {
    return this.registry.getQualityGates();
  }
}
