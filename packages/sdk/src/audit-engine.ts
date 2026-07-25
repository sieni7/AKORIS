import { RegistryReader } from './registry-reader.js';
import { ManifestManager } from './manifest-manager.js';
import { Validator } from './validator.js';
import type { AuditReport } from './types.js';

export class AuditEngine {
  private validator: Validator;

  constructor(registry?: RegistryReader, manifest?: ManifestManager) {
    const r = registry || new RegistryReader();
    const m = manifest || new ManifestManager();
    this.validator = new Validator(r, m);
  }

  async run(): Promise<AuditReport> {
    const validation = this.validator.validateAll();

    const checks = [
      {
        name: 'MANIFEST.json valide',
        passed: !validation.errors.some(e => e.startsWith('[MANIFEST]')),
        details: validation.errors.filter(e => e.startsWith('[MANIFEST]')).join(', '),
      },
      {
        name: 'Structure du projet',
        passed: !validation.errors.some(e => e.startsWith('[STRUCTURE]')),
        details: validation.errors.filter(e => e.startsWith('[STRUCTURE]')).join(', '),
      },
      {
        name: 'Registry complet',
        passed: !validation.errors.some(e => e.startsWith('[REGISTRY]')),
        details: validation.errors.filter(e => e.startsWith('[REGISTRY]')).join(', '),
      },
    ];

    const passed = checks.filter(c => c.passed).length;
    const failed = checks.filter(c => !c.passed).length;

    return {
      date: new Date().toISOString(),
      status: failed === 0 ? 'passed' : 'failed',
      checks,
      summary: { passed, failed, total: checks.length },
    };
  }
}
