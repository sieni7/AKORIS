import { Command } from "commander";
import { step, info, success } from "../utils/logger.js";

export const auditCommand = new Command("audit")
  .description("Lance un audit (sprint, project, release)")
  .addCommand(
    new Command("sprint")
      .argument("<n>", "Numéro du sprint")
      .description("Audite un sprint spécifique")
      .action((n: string) => {
        step(`Audit du sprint ${n}`);
        info("Fonctionnalité à implémenter");
      })
  )
  .addCommand(
    new Command("project")
      .description("Audite l'ensemble du projet")
      .action(() => {
        step("Audit complet du projet");
        info("Fonctionnalité à implémenter");
      })
  )
  .addCommand(
    new Command("release")
      .description("Audite une release")
      .action(() => {
        step("Audit de release");
        info("Fonctionnalité à implémenter");
      })
  );
