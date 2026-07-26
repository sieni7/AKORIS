import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { CheckResult } from '../types/index.js';

export class ValidatorService {
  private projectRoot: string;

  constructor(projectRoot?: string) {
    this.projectRoot = projectRoot || process.cwd();
  }

  async validateProjectStructure(): Promise<CheckResult[]> {
    const results: CheckResult[] = [];

    const requiredDirs = ['.akoris', 'docs'];
    for (const dir of requiredDirs) {
      const exists = existsSync(join(this.projectRoot, dir));
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
    const manifestService = new ManifestService(this.projectRoot);
    const { valid, errors } = manifestService.validate();

    return {
      gate: 'manifest-validation',
      name: 'MANIFEST.json valide',
      passed: valid,
      details: valid ? 'MANIFEST.json valide' : errors.join(', '),
    };
  }
}
