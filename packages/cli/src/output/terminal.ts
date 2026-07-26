import chalk from 'chalk';
import Table from 'cli-table3';
import { inspect } from 'util';
import type { IRenderer, TreeNode, Card, TimelineEvent } from './renderer.js';
import { theme } from '../ui/theme.js';
import { icons } from '../ui/icons.js';

export class TerminalRenderer implements IRenderer {
  info(msg: string) { console.log(`${icons.info} ${msg}`); }
  success(msg: string) { console.log(chalk.green(`${icons.success} ${msg}`)); }
  warning(msg: string) { console.log(chalk.yellow(`${icons.warning} ${msg}`)); }
  error(msg: string) { console.log(chalk.red(`${icons.error} ${msg}`)); }

  table<T extends Record<string, unknown>>(rows: T[], options?: { headers?: string[]; caption?: string }) {
    if (rows.length === 0) { this.info('No data.'); return; }
    const headers = options?.headers ?? Object.keys(rows[0]);
    const t = new Table({ head: headers.map((h) => chalk.bold(h)), style: { head: ['cyan'] } });
    for (const row of rows) t.push(headers.map((h) => String(row[h] ?? '')));
    if (options?.caption) console.log(chalk.dim(options.caption));
    console.log(t.toString());
  }

  tree(root: TreeNode) { this._printTree(root, ''); }

  private _printTree(node: TreeNode, prefix: string) {
    const icon = node.icon ? `${node.icon} ` : '';
    console.log(`${prefix}${icon}${node.label}`);
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const last = i === node.children.length - 1;
        this._printTree(node.children[i], `${prefix}${last ? '  ' : '│ '}`);
      }
    }
  }

  card(card: Card) {
    const color = card.color ? theme[card.color] : theme.primary;
    const width = 60;
    const sep = chalk.dim('─'.repeat(width));
    console.log(`${sep}`);
    console.log(`${color(chalk.bold(` ${card.title}`))}`);
    if (card.subtitle) console.log(`  ${chalk.dim(card.subtitle)}`);
    console.log(`${sep}`);
    for (const f of card.fields) {
      const val = f.color ? theme[f.color](f.value) : f.value;
      console.log(`  ${chalk.dim(f.label + ':')} ${val}`);
    }
    if (card.footer) console.log(`${sep}\n  ${chalk.dim(card.footer)}`);
    console.log(`${sep}\n`);
  }

  timeline(events: TimelineEvent[]) {
    for (const e of events) {
      const icon = e.icon ?? '●';
      const color = e.color ? theme[e.color] : theme.muted;
      console.log(`  ${chalk.dim(e.timestamp)} ${color(icon)} ${e.label}`);
    }
  }

  progress(current: number, total: number, label?: string) {
    const pct = Math.round((current / total) * 100);
    const barLen = 20;
    const filled = Math.round((barLen * current) / total);
    const bar = chalk.green('█'.repeat(filled)) + chalk.dim('░'.repeat(barLen - filled));
    const msg = label ? ` ${label}` : '';
    process.stdout.write(`\r${bar} ${pct}%${msg}`);
    if (current >= total) process.stdout.write('\n');
  }

  write(data: unknown) {
    console.log(inspect(data, { colors: true, depth: 3 }));
  }
}
