import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export class SyncService {
  private registryPath: string;
  private projectPath: string;

  constructor(registryPath?: string, projectPath?: string) {
    this.registryPath = registryPath || resolve(process.cwd(), 'registry');
    this.projectPath = projectPath || process.cwd();
  }

  syncRegistry(): { updated: number; skipped: number } {
    const targetDir = join(this.projectPath, '.akoris');
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

    let updated = 0;
    let skipped = 0;

    const syncDir = (relativePath: string) => {
      const src = join(this.registryPath, relativePath);
      const dest = join(targetDir, relativePath);
      if (!existsSync(src)) return;

      if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

      const files = readdirSync(src);
      for (const file of files) {
        try {
          copyFileSync(join(src, file), join(dest, file));
          updated++;
        } catch {
          skipped++;
        }
      }
    };

    const domains = ['policies', 'contracts', 'agents', 'quality-gates', 'checklists', 'metrics'];
    for (const domain of domains) {
      syncDir(domain);
    }

    return { updated, skipped };
  }
}
