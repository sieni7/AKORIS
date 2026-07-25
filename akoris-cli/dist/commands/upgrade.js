import { Command } from "commander";
import { step, info } from "../utils/logger.js";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAkorisDir } from "../utils/files.js";
export const upgradeCommand = new Command("upgrade")
    .description("Met à jour AKORIS vers la dernière version")
    .action(() => {
    step("Mise à jour AKORIS");
    if (!existsSync(getAkorisDir())) {
        info("Aucun projet AKORIS trouvé");
        return;
    }
    const manifestPath = join(getAkorisDir(), "MANIFEST.json");
    if (existsSync(manifestPath)) {
        const m = JSON.parse(readFileSync(manifestPath, "utf-8"));
        const oldVersion = m.methodVersion;
        m.methodVersion = "2.0.0";
        m.updatedAt = new Date().toISOString().split("T")[0];
        writeFileSync(manifestPath, JSON.stringify(m, null, 2));
        info(`Mise à jour : ${oldVersion} → 2.0.0`);
    }
    info("Fonctionnalité complète à implémenter");
});
