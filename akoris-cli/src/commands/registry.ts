import { Command } from "commander";
import { step, info } from "../utils/logger.js";

export const registryCommand = new Command("registry")
  .description("Gère le Registry AKORIS")
  .addCommand(
    new Command("info")
      .description("Affiche les informations du Registry")
      .action(() => {
        step("Registry AKORIS");
        info("Fonctionnalité à implémenter");
      })
  )
  .addCommand(
    new Command("update")
      .description("Met à jour le Registry local")
      .action(() => {
        step("Mise à jour du Registry");
        info("Fonctionnalité à implémenter");
      })
  )
  .addCommand(
    new Command("sync")
      .description("Synchronise le Registry avec la version officielle")
      .action(() => {
        step("Synchronisation du Registry");
        info("Fonctionnalité à implémenter");
      })
  );
