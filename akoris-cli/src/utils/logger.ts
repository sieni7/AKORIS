import chalk from "chalk";
import ora from "ora";

export function info(msg: string): void {
  console.log(chalk.blue("ℹ"), msg);
}

export function success(msg: string): void {
  console.log(chalk.green("✔"), msg);
}

export function warn(msg: string): void {
  console.log(chalk.yellow("⚠"), msg);
}

export function error(msg: string): void {
  console.log(chalk.red("✖"), msg);
}

export function step(msg: string): void {
  console.log(chalk.cyan("\n◆"), chalk.bold(msg));
}

export function spinner(msg: string) {
  return ora({ text: msg, color: "cyan" }).start();
}
