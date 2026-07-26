import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export class AliasManager {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  private getAliasesPath(): string {
    return join(this.projectRoot, '.akoris', 'aliases.json');
  }

  async listAliases(): Promise<Record<string, string>> {
    const path = this.getAliasesPath();
    try {
      const content = await readFile(path, 'utf-8');
      return JSON.parse(content);
    } catch (_) {
      return {};
    }
  }

  private async ensureDir(): Promise<void> {
    await mkdir(dirname(this.getAliasesPath()), { recursive: true });
  }

  async setAlias(name: string, command: string): Promise<void> {
    await this.ensureDir();
    const aliases = await this.listAliases();
    aliases[name] = command;
    await writeFile(this.getAliasesPath(), JSON.stringify(aliases, null, 2), 'utf-8');
  }

  async removeAlias(name: string): Promise<boolean> {
    await this.ensureDir();
    const aliases = await this.listAliases();
    if (!aliases[name]) return false;
    delete aliases[name];
    await writeFile(this.getAliasesPath(), JSON.stringify(aliases, null, 2), 'utf-8');
    return true;
  }

  async resolveAlias(name: string): Promise<string | null> {
    const aliases = await this.listAliases();
    return aliases[name] || null;
  }
}
