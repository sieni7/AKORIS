import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ValidationResult } from './types.js';

export interface Manifest {
  'akoris': string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  registry: { version: string; url?: string };
  playbook?: string;
  projectType?: string;
  components?: Record<string, boolean>;
  tools?: Record<string, string>;
}

export class ManifestManager {
  constructor(private projectPath: string = process.cwd()) {}

  private get manifestPath(): string {
    return join(this.projectPath, 'MANIFEST.json');
  }

  exists(): boolean {
    return existsSync(this.manifestPath);
  }

  read(): Manifest {
    return JSON.parse(readFileSync(this.manifestPath, 'utf-8'));
  }

  write(manifest: Manifest): void {
    writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    try {
      const m = this.read();
      if (!m.akoris) errors.push('Missing "akoris" field');
      if (!m.name) errors.push('Missing "name" field');
      if (!m.version) errors.push('Missing "version" field');
      if (!m.registry?.version) errors.push('Missing "registry.version"');
    } catch {
      errors.push('Cannot read or parse MANIFEST.json');
    }
    return { valid: errors.length === 0, errors };
  }

  createDefault(name: string, type: string = 'app'): Manifest {
    return {
      'akoris': '1.0.0',
      name,
      version: '1.0.0',
      registry: { version: '1.0.0' },
      projectType: type,
    };
  }
}
