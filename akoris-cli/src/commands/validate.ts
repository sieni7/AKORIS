import { Command } from "commander";
import { step, info } from "../utils/logger.js";

export const validateCommand = new Command("validate")
  .description("Valide un aspect du projet")
  .addCommand(
    new Command("architecture")
      .description("Valide l'architecture du projet")
      .action(() => {
        step("Validation de l'architecture");
        info("Fonctionnalité à implémenter");
      })
  )
  .addCommand(
    new Command("documentation")
      .description("Valide la documentation du projet")
      .action(() => {
        step("Validation de la documentation");
        info("Fonctionnalité à implémenter");
      })
  )
  .addCommand(
    new Command("all")
      .description("Valide tous les aspects du projet")
      .action(() => {
        step("Validation complète du projet");
        info("Fonctionnalité à implémenter");
      })
  );
