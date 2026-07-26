import type { IRenderer, TreeNode, Card, TimelineEvent } from './renderer.js';

export class JSONRenderer implements IRenderer {
  private _stdout(data: unknown) { console.log(JSON.stringify(data)); }
  private _stderr(msg: string, type: string) { console.error(JSON.stringify({ type, message: msg })); }

  info(msg: string) { this._stderr(msg, 'info'); }
  success(msg: string) { this._stderr(msg, 'success'); }
  warning(msg: string) { this._stderr(msg, 'warning'); }
  error(msg: string) { this._stderr(msg, 'error'); }

  table<T extends Record<string, unknown>>(rows: T[]) { this._stdout(rows); }
  tree(root: TreeNode) { this._stdout(root); }
  card(card: Card) { this._stdout(card); }
  timeline(events: TimelineEvent[]) { this._stdout(events); }
  progress(_current: number, _total: number, _label?: string) { /* silent */ }
  write(data: unknown) { this._stdout(data); }
}
