import { Command } from "commander";
import { step, info } from "../utils/logger.js";

export const knowledgeCommand = new Command("knowledge")
  .description("Gère les connaissances du projet")
  .addCommand(
    new Command("export")
      .option("-f, --format <format>", "Format d'export (md, json)")
      .description("Exporte les connaissances capitalisées")
      .action((options: { format?: string }) => {
        step("Export des connaissances");
        info(`Format : ${options.format || "md"}`);
        info("Fonctionnalité à implémenter");
      })
  )
  .addCommand(
    new Command("search")
      .argument("<query>", "Terme de recherche")
      .description("Recherche dans les connaissances")
      .action((query: string) => {
        step(`Recherche : ${query}`);
        info("Fonctionnalité à implémenter");
      })
  );
