import { join } from "node:path";
import { ensureDir, getAkorisDir } from "../utils/files.js";
import { success, step } from "../utils/logger.js";
const AKORIS_DIRS = [
    "constitution",
    "gouvernance/contrats",
    "decisions/adr",
    "backlog",
    "sprints",
    "audits",
    "connaissances",
    "metriques",
    "playbooks",
    "templates",
    "registry/agents",
    "registry/policies",
    "registry/quality-gates",
    "registry/checklists",
    "registry/workflows",
    "registry/knowledge",
    "logs",
    "cache",
];
export function generateStructure() {
    const base = getAkorisDir();
    step("Création de la structure .akoris/");
    for (const dir of AKORIS_DIRS) {
        ensureDir(join(base, dir));
    }
    success("Structure .akoris/ créée");
}
