import { Command } from "commander";
import { generateStructure } from "../generators/structure.js";
import { writeManifest } from "../generators/manifest.js";
import { writeFile, getAkorisDir } from "../utils/files.js";
import { join } from "node:path";
import { step, success } from "../utils/logger.js";
import { generateConstitution } from "../generators/constitution.js";
export const initCommand = new Command("init")
    .description("Initialise .akoris/ + MANIFEST + Constitution")
    .option("-p, --project <name>", "Nom du projet")
    .option("-o, --owner <name>", "Propriétaire du projet")
    .option("-e, --engine <name>", "Moteur d'exécution (OpenCode, Cursor...)")
    .action(async (options) => {
    step("Initialisation AKORIS");
    generateStructure();
    writeManifest({
        project: options.project || "",
        owner: options.owner || "",
        executionEngine: options.engine || "",
    });
    await generateConstitution();
    // README .akoris
    writeFile(join(getAkorisDir(), "README.md"), `# AKORIS — ${options.project || "Projet"}\n\nMémoire opérationnelle du projet. Versionné avec le projet.\n`);
    success("Projet initialisé avec AKORIS");
    console.log("\n📁 .akoris/ prêt");
    console.log("📄 .akoris/MANIFEST.json");
    console.log("📄 .akoris/constitution/constitution.md");
    console.log("\nProchaine étape : akoris doctor");
});
