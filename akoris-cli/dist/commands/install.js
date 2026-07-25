import { Command } from "commander";
import { step, info } from "../utils/logger.js";
export const installCommand = new Command("install")
    .description("Installe un playbook, expert ou template")
    .addCommand(new Command("playbook")
    .argument("<name>", "Nom du playbook")
    .description("Installe un playbook (react-supabase, laravel...)")
    .action((name) => {
    step(`Installation du playbook : ${name}`);
    info("Fonctionnalité à implémenter");
}))
    .addCommand(new Command("expert")
    .argument("<id>", "Identifiant de l'expert")
    .description("Installe un expert dans le projet")
    .action((id) => {
    step(`Installation de l'expert : ${id}`);
    info("Fonctionnalité à implémenter");
}))
    .addCommand(new Command("template")
    .argument("<name>", "Nom du template")
    .description("Installe un template")
    .action((name) => {
    step(`Installation du template : ${name}`);
    info("Fonctionnalité à implémenter");
}));
