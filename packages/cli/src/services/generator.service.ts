import { writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { ManifestService } from './manifest.service.js';
import type { Manifest } from '../types/index.js';

export class GeneratorService {
  async init(projectPath: string, name: string, type: string = 'app'): Promise<void> {
    const dirs = [
      '.akoris/agents',
      '.akoris/decisions',
      '.akoris/audits',
      '.akoris/metrics',
      '.akoris/knowledge',
      '.akoris/contracts',
      'docs/architecture',
      'docs/guides',
      'docs/api',
      'src',
      'tests',
    ];

    for (const dir of dirs) {
      mkdirSync(join(projectPath, dir), { recursive: true });
    }

    const manifestService = new ManifestService(projectPath);
    const manifest = manifestService.createDefault(name, type);
    manifestService.write(manifest);

    const gitignorePath = join(projectPath, '.gitignore');
    if (!existsSync(gitignorePath)) {
      writeFileSync(gitignorePath, 'node_modules/\ndist/\n.env\n');
    }

    const readmePath = join(projectPath, 'README.md');
    if (!existsSync(readmePath)) {
      writeFileSync(readmePath, `# ${name}\n\nProjet gouverné par AKORIS - Standard de gouvernance pour le développement logiciel assisté par IA.\n`);
    }
  }

  async installPlaybook(playbookPath: string, projectPath: string): Promise<void> {
    if (existsSync(playbookPath)) {
      cpSync(playbookPath, join(projectPath, '.akoris'), { recursive: true });
    }
  }
}
