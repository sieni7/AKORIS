import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
export function ensureDir(dir) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}
export function writeFile(filePath, content) {
    writeFileSync(filePath, content, "utf-8");
}
export function fileExists(filePath) {
    return existsSync(filePath);
}
export function getAkorisDir() {
    return join(process.cwd(), ".akoris");
}
