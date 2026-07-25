import { Command } from "commander";
import { step, info } from "../utils/logger.js";
import chalk from "chalk";
export const qualityCommand = new Command("quality")
    .description("Gère les Quality Gates")
    .addCommand(new Command("check")
    .description("Vérifie tous les Quality Gates")
    .action(() => {
    step("Vérification des Quality Gates");
    info("Fonctionnalité à implémenter");
}))
    .addCommand(new Command("list")
    .description("Liste les Quality Gates disponibles")
    .action(() => {
    step("Quality Gates AKORIS");
    const gates = [
        { id: "architecture", desc: "Conforme aux spécifications" },
        { id: "documentation", desc: "Documentation à jour et complète" },
        { id: "tests", desc: "Tests validés avec couverture satisfaisante" },
        { id: "audit", desc: "Rapport d'audit favorable" },
        { id: "debt", desc: "Dette technique acceptable et documentée" },
        { id: "security", desc: "Sécurité validée" },
        { id: "adr", desc: "ADR à jour" },
    ];
    for (const g of gates) {
        console.log(`  ${chalk.cyan("🔷")} ${g.id.padEnd(16)} ${g.desc}`);
    }
}))
    .addCommand(new Command("validate <gate>")
    .description("Valide un Quality Gate spécifique")
    .action((gate) => {
    step(`Validation du gate : ${gate}`);
    info("Fonctionnalité à implémenter");
}));
