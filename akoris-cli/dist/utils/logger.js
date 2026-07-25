import chalk from "chalk";
import ora from "ora";
export function info(msg) {
    console.log(chalk.blue("ℹ"), msg);
}
export function success(msg) {
    console.log(chalk.green("✔"), msg);
}
export function warn(msg) {
    console.log(chalk.yellow("⚠"), msg);
}
export function error(msg) {
    console.log(chalk.red("✖"), msg);
}
export function step(msg) {
    console.log(chalk.cyan("\n◆"), chalk.bold(msg));
}
export function spinner(msg) {
    return ora({ text: msg, color: "cyan" }).start();
}
