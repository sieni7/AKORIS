import type { Alias } from './types.js';
import { NotFoundError } from './errors.js';

export class AliasManager {
  private aliases: Map<string, Alias> = new Map();

  setAlias(alias: Alias): void {
    this.aliases.set(alias.name, alias);
  }

  getAlias(name: string): Alias {
    const alias = this.aliases.get(name);
    if (!alias) throw new NotFoundError('Alias', name);
    return alias;
  }

  removeAlias(name: string): boolean {
    return this.aliases.delete(name);
  }

  listAliases(): Alias[] {
    return Array.from(this.aliases.values());
  }

  resolve(name: string): string | undefined {
    return this.aliases.get(name)?.command;
  }
}
