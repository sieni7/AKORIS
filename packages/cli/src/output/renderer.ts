import { TerminalRenderer } from './terminal.js';
import { JSONRenderer } from './json.js';

export interface TreeNode { label: string; icon?: string; children?: TreeNode[]; meta?: Record<string, string> }

export interface CardField { label: string; value: string; color?: 'primary' | 'success' | 'warning' | 'error' | 'muted' }

export interface Card { title: string; subtitle?: string; fields: CardField[]; footer?: string; color?: 'primary' | 'success' | 'warning' | 'error' | 'muted' }

export interface TimelineEvent { timestamp: string; label: string; icon?: string; color?: 'success' | 'warning' | 'error' | 'muted' }

export interface IRenderer {
  info(message: string): void;
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
  table<T extends Record<string, unknown>>(rows: T[], options?: { headers?: string[]; caption?: string }): void;
  tree(root: TreeNode): void;
  card(card: Card): void;
  timeline(events: TimelineEvent[]): void;
  progress(current: number, total: number, label?: string): void;
  write(data: unknown): void;
}

export function createRenderer(options?: { format?: 'terminal' | 'json' | 'markdown' }): IRenderer {
  if (options?.format === 'json') return new JSONRenderer();
  if (!process.stdout.isTTY || process.env.NO_COLOR) return new JSONRenderer();
  return new TerminalRenderer();
}
