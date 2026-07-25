import { OpenCodeAdapter } from './opencode/adapter.js';
import { CursorAdapter } from './cursor/adapter.js';
import { ClaudeCodeAdapter } from './claude-code/adapter.js';
import { CodexAdapter } from './codex/adapter.js';
import type { AdapterContract } from './index.js';

const adapters: Record<string, new () => AdapterContract> = {
  opencode: OpenCodeAdapter,
  cursor: CursorAdapter,
  'claude-code': ClaudeCodeAdapter,
  codex: CodexAdapter,
};

export function getAdapter(engine: string): AdapterContract | null {
  const AdapterClass = adapters[engine.toLowerCase()];
  if (!AdapterClass) return null;
  return new AdapterClass();
}

export function listAdapters(): string[] {
  return Object.keys(adapters);
}
