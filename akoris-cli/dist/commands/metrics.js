import { Command } from "commander";
import { step, info } from "../utils/logger.js";
export const metricsCommand = new Command("metrics")
    .description("Affiche ou exporte les métriques du projet")
    .argument("[type]", "Type de métriques (quality, coverage, debt, releases...)")
    .option("-e, --export <format>", "Format d'export (json, csv)")
    .action((type, options) => {
    if (type) {
        step(`Métriques : ${type}`);
    }
    else {
        step("Métriques du projet");
    }
    if (options.export) {
        info(`Export au format ${options.export}`);
    }
    info("Fonctionnalité à implémenter");
});
