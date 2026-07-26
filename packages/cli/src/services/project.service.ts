import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export function ensureProjectDirectories(projectRoot: string): string[] {
  const created: string[] = [];
  const dirs = [
    join(projectRoot, '.akoris'),
    join(projectRoot, '.akoris', 'logs'),
    join(projectRoot, '.akoris', 'logs', 'sessions'),
    join(projectRoot, '.akoris', 'decisions'),
    join(projectRoot, '.akoris', 'sprints'),
    join(projectRoot, '.akoris', 'audits'),
    join(projectRoot, '.akoris', 'metrics'),
    join(projectRoot, '.akoris', 'knowledge'),
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      created.push(dir);
    }
  }
  return created;
}

export function getProjectRoot(): string {
  return process.cwd();
}
