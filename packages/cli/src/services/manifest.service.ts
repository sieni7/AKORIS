import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Manifest } from '../types/index.js';

export class ManifestService {
  private manifestPath: string;

  constructor(projectPath?: string) {
    this.manifestPath = join(projectPath || process.cwd(), 'MANIFEST.json');
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

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    try {
      const manifest = this.read();
      if (!manifest.akoris) errors.push('Champ "akoris" manquant');
      if (!manifest.name) errors.push('Champ "name" manquant');
      if (!manifest.version) errors.push('Champ "version" manquant');
      if (!manifest.registry) errors.push('Champ "registry" manquant');
      if (!manifest.registry.version) errors.push('Champ "registry.version" manquant');
    } catch {
      errors.push('Fichier MANIFEST.json invalide ou introuvable');
    }
    return { valid: errors.length === 0, errors };
  }

  createDefault(name: string, projectType: string = 'app'): Manifest {
    return {
      'akoris': '1.0.0',
      name,
      version: '1.0.0',
      description: `Projet ${name} gouverné par AKORIS`,
      registry: {
        version: '1.0.0',
      },
      playbook: 'core',
      projectType,
      components: {
        cli: true,
      },
      tools: {
        packageManager: 'pnpm',
        language: 'typescript',
      },
    };
  }
}
