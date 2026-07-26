import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Aliases {
  [name: string]: string;
}

function getAliasesPath(projectRoot: string): string {
  return join(projectRoot, '.akoris', 'aliases.json');
}

export function readAliases(projectRoot: string): Aliases {
  const path = getAliasesPath(projectRoot);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

export function writeAliases(projectRoot: string, aliases: Aliases): void {
  const path = getAliasesPath(projectRoot);
  const dir = join(projectRoot, '.akoris');
  if (!existsSync(dir)) {
    throw new Error(`Le dossier .akoris/ est introuvable. Lancez "akoris doctor --fix" d'abord.`);
  }
  writeFileSync(path, JSON.stringify(aliases, null, 2), 'utf-8');
}

export function setAlias(projectRoot: string, name: string, command: string): void {
  const aliases = readAliases(projectRoot);
  aliases[name] = command;
  writeAliases(projectRoot, aliases);
}

export function removeAlias(projectRoot: string, name: string): boolean {
  const aliases = readAliases(projectRoot);
  if (!(name in aliases)) return false;
  delete aliases[name];
  writeAliases(projectRoot, aliases);
  return true;
}

export function resolveAlias(projectRoot: string, name: string): string | null {
  const aliases = readAliases(projectRoot);
  return aliases[name] ?? null;
}
