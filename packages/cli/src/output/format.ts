import chalk from 'chalk';
import ora from 'ora';

export interface GlobalOptions {
  json?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  noColor?: boolean;
  output?: string;
}

let _opts: GlobalOptions = {};

export function setGlobalOptions(opts: GlobalOptions): void {
  _opts = opts;
}

export function getOpts(): GlobalOptions {
  return _opts;
}

export function shouldOutputJSON(): boolean {
  return !!_opts.json;
}

export function isVerbose(): boolean {
  return !!_opts.verbose;
}

export function isQuiet(): boolean {
  return !!_opts.quiet;
}

export function log(msg: string, level: 'normal' | 'verbose' | 'quiet' = 'normal'): void {
  if (_opts.quiet && level !== 'normal') return;
  if (level === 'verbose' && !_opts.verbose) return;
  console.log(msg);
}

export function success(msg: string): void {
  if (_opts.quiet) return;
  console.log(chalk.green(`✅ ${msg}`));
}

export function warn(msg: string): void {
  if (_opts.quiet) return;
  console.log(chalk.yellow(`⚠️  ${msg}`));
}

export function error(msg: string): void {
  console.error(chalk.red(`❌ ${msg}`));
}

export function info(msg: string): void {
  if (_opts.quiet) return;
  console.log(chalk.blue(`ℹ️  ${msg}`));
}

export function title(msg: string): void {
  if (_opts.quiet) return;
  console.log(chalk.bold.cyan(`\n${msg}`));
}

export function header(msg: string): void {
  if (_opts.quiet) return;
  console.log(chalk.bold(`\n${msg}`));
}

export function printJSON(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(headers: string[], rows: string[][], indent: number = 2): void {
  const pad = ' '.repeat(indent);
  for (const row of rows) {
    const line = row.map((cell, i) => {
      if (i === 0) return chalk.bold(cell);
      return cell;
    }).join('  ');
    console.log(`${pad}${line}`);
  }
}

export function spinner(msg: string) {
  const s = ora({ text: msg, color: 'cyan' });
  if (_opts.quiet) {
    return { start: () => {}, succeed: () => {}, fail: () => {}, stop: () => {}, text: '' };
  }
  return s;
}
