import { Command } from "commander";
import { getAkorisDir } from "../utils/files.js";
import { join } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { step, success, warn } from "../utils/logger.js";
export const doctorCommand = new Command("doctor")
    .description("Diagnostique l'état du projet AKORIS")
    .option("--fix", "Tente de corriger les problèmes détectés")
    .action((options) => {
    step("Diagnostic AKORIS");
    const issues = [];
    const fixes = [];
    // Vérifier .akoris/
    if (!existsSync(getAkorisDir())) {
        issues.push("❌ .akoris/ manquant");
    }
    else {
        success("✅ .akoris/ présent");
    }
    // Vérifier MANIFEST.json
    const manifestPath = join(getAkorisDir(), "MANIFEST.json");
    if (!existsSync(manifestPath)) {
        issues.push("❌ MANIFEST.json manquant");
    }
    else {
        try {
            const m = JSON.parse(readFileSync(manifestPath, "utf-8"));
            if (!m.project)
                issues.push("⚠️  Projet non défini dans MANIFEST.json");
            if (!m.owner)
                issues.push("⚠️  Propriétaire non défini dans MANIFEST.json");
            success("✅ MANIFEST.json valide");
        }
        catch {
            issues.push("❌ MANIFEST.json invalide");
        }
    }
    // Vérifier constitution
    const constitutionPath = join(getAkorisDir(), "constitution", "constitution.md");
    if (!existsSync(constitutionPath)) {
        issues.push("❌ Constitution manquante");
    }
    else {
        success("✅ Constitution présente");
    }
    // Vérifier git
    if (!existsSync(join(process.cwd(), ".git"))) {
        warn("⚠️  Projet non versionné (pas de .git)");
    }
    else {
        success("✅ Git initialisé");
    }
    console.log("");
    if (issues.length === 0) {
        success("Aucun problème détecté");
    }
    else {
        for (const issue of issues) {
            console.log(issue);
        }
        if (options.fix) {
            console.log("\n🔧 Fix automatique non encore implémenté");
        }
        else {
            console.log("\n💡 Utilisez --fix pour tenter une correction automatique");
        }
    }
});
