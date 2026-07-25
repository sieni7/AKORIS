import { Command } from "commander";
import { step, info } from "../utils/logger.js";
export const playbookCommand = new Command("playbook")
    .description("Gère les playbooks")
    .addCommand(new Command("list")
    .description("Liste les playbooks disponibles")
    .action(() => {
    step("Playbooks disponibles");
    info("Fonctionnalité à implémenter");
}))
    .addCommand(new Command("current")
    .description("Affiche le playbook actif")
    .action(() => {
    step("Playbook actif");
    info("Fonctionnalité à implémenter");
}))
    .addCommand(new Command("install")
    .argument("<name>", "Nom du playbook")
    .description("Installe un playbook")
    .action((name) => {
    step(`Installation du playbook : ${name}`);
    info("Fonctionnalité à implémenter");
}));
