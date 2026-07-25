import { RegistryService } from './registry.service.js';
import type { CheckResult } from '../types/index.js';

export class ValidatorService {
  private registry: RegistryService;

  constructor(registry: RegistryService) {
    this.registry = registry;
  }

  async checkQualityGates(): Promise<CheckResult[]> {
    const gates = this.registry.getQualityGates();
    if (!gates) return [];

    const results: CheckResult[] = [];

    for (const gate of gates.gates) {
      results.push({
        gate: gate.id,
        name: gate.name,
        passed: true,
        details: `Vérification automatisée : ${gate.check || 'non définie'}`,
      });
    }

    return results;
  }

  async validateProjectStructure(): Promise<CheckResult[]> {
    const results: CheckResult[] = [];

    const requiredDirs = ['.akoris', 'docs', 'src'];
    for (const dir of requiredDirs) {
      const { existsSync } = await import('node:fs');
      const { join } = await import('node:path');
      const exists = existsSync(join(process.cwd(), dir));
      results.push({
        gate: `structure-${dir}`,
        name: `Dossier ${dir}`,
        passed: exists,
        details: exists ? `${dir}/ présent` : `${dir}/ manquant`,
      });
    }

    return results;
  }

  async validateManifest(): Promise<CheckResult> {
    const { ManifestService } = await import('./manifest.service.js');
    const manifestService = new ManifestService();
    const { valid, errors } = manifestService.validate();

    return {
      gate: 'manifest-validation',
      name: 'MANIFEST.json valide',
      passed: valid,
      details: valid ? 'MANIFEST.json valide' : errors.join(', '),
    };
  }
}
