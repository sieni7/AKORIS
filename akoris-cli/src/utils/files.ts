import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): void {
  writeFileSync(filePath, content, "utf-8");
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function getAkorisDir(): string {
  return join(process.cwd(), ".akoris");
}
