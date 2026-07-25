import { RegistryReader } from './registry-reader.js';
import { ManifestManager } from './manifest-manager.js';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ValidationResult } from './types.js';

export class Validator {
  constructor(
    private registry: RegistryReader,
    private manifest: ManifestManager,
  ) {}

  validateAll(): ValidationResult {
    const errors: string[] = [];

    const manifestResult = this.manifest.validate();
    errors.push(...manifestResult.errors.map(e => `[MANIFEST] ${e}`));

    const requiredDirs = ['.akoris', 'docs', 'src'];
    for (const dir of requiredDirs) {
      if (!existsSync(join(this.manifest['projectPath'] || process.cwd(), dir))) {
        errors.push(`[STRUCTURE] Missing directory: ${dir}/`);
      }
    }

    const registrySummary = this.registry.summary();
    if (registrySummary.policies === 0) {
      errors.push('[REGISTRY] No policies found');
    }

    return { valid: errors.length === 0, errors };
  }
}
