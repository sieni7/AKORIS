import { Command } from "commander";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getAkorisDir } from "../utils/files.js";
import { step, success, warn, error, info } from "../utils/logger.js";
import chalk from "chalk";

export const statusCommand = new Command("status")
  .description("Affiche l'état de santé du projet")
  .action(() => {
    step("État du projet AKORIS");

    const base = getAkorisDir();

    if (!existsSync(base)) {
      error("Projet non initialisé avec AKORIS");
      console.log("  Exécutez : akoris init");
      return;
    }

    // Lire le manifeste
    const manifestPath = join(base, "MANIFEST.json");
    if (existsSync(manifestPath)) {
      const m = JSON.parse(readFileSync(manifestPath, "utf-8"));
      console.log(chalk.bold("\n📋 Manifeste"));
      console.log(`  Projet    : ${m.project || "-"}`);
      console.log(`  Méthode   : ${m.method} ${m.methodVersion}`);
      console.log(`  CLI       : v${m.cliVersion}`);
      console.log(`  Playbook  : ${m.playbook || "-"}`);
      console.log(`  Workflow  : ${m.workflow || "-"}`);
      console.log(`  Moteur    : ${m.executionEngine || "-"}`);
      console.log(`  Owner     : ${m.owner || "-"}`);
    }

    // Vérifier les dossiers
    const dirs = [
      "gouvernance/contrats",
      "decisions/adr",
      "backlog",
      "sprints",
      "audits",
      "connaissances",
      "metriques",
      "registry/agents",
      "registry/policies",
    ];

    console.log(chalk.bold("\n📁 Dossiers"));
    for (const d of dirs) {
      const ok = existsSync(join(base, d));
      console.log(`  ${ok ? "✅" : "⬜"} ${d}`);
    }

    // Vérifier les sprints
    console.log(chalk.bold("\n📊 Sprints"));
    const sprintsDir = join(base, "sprints");
    if (existsSync(sprintsDir)) {
      try {
        const sprints = readdirSync(sprintsDir);
        if (sprints.length === 0) {
          info("Aucun sprint démarré");
        } else {
          for (const s of sprints) {
            console.log(`  📁 ${s}`);
          }
        }
      } catch {
        info("Aucun sprint");
      }
    }

    // Vérifier les audits
    const auditsDir = join(base, "audits");
    if (existsSync(auditsDir)) {
      try {
        const audits = readdirSync(auditsDir);
        if (audits.length > 0) {
          console.log(chalk.bold("\n🔍 Audits disponibles :"));
          for (const a of audits) {
            console.log(`  📄 ${a}`);
          }
        } else {
          warn("Aucun audit trouvé");
        }
      } catch {
        warn("Aucun audit trouvé");
      }
    }
  });
