import { readFileSync, readdirSync, watch, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface LogEntry {
  timestamp: string;
  agentId: string;
  action: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

export interface LogFilter {
  agent?: string;
  since?: string;
  lines?: number;
}

export class LogReader {
  private logDir: string;

  constructor(projectRoot: string = process.cwd()) {
    this.logDir = join(projectRoot, '.akoris', 'logs', 'sessions');
  }

  readLogs(filter: LogFilter = {}): LogEntry[] {
    const entries: LogEntry[] = [];

    try {
      const files = readdirSync(this.logDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const filePath = join(this.logDir, file);
        const content = readFileSync(filePath, 'utf-8');
        try {
          const data = JSON.parse(content);
          const logs = Array.isArray(data) ? data : (data.entries || []);
          for (const entry of logs) {
            if (this.matchesFilter(entry, filter)) {
              entries.push(this.normalizeEntry(entry));
            }
          }
        } catch {
        }
      }
    } catch {
    }

    entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    if (filter.lines && filter.lines > 0) {
      return entries.slice(0, filter.lines);
    }
    return entries;
  }

  watchLogs(
    filter: LogFilter,
    onEntry: (entry: LogEntry) => void,
    onError?: (err: Error) => void,
  ): { stop: () => void } {
    const dir = this.logDir;
    const entryCounts = new Map<string, number>();

    if (!existsSync(dir)) {
      onError?.(new Error(`Dossier introuvable : ${dir}. Lancez d'abord 'akoris doctor --fix'`));
      return { stop: () => {} };
    }

    const readNewEntries = (filePath: string) => {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        const logs = Array.isArray(data) ? data : (data.entries || []);
        const prevCount = entryCounts.get(filePath) || 0;

        for (let i = prevCount; i < logs.length; i++) {
          const entry = logs[i];
          if (entry && this.matchesFilter(entry, filter)) {
            onEntry(this.normalizeEntry(entry));
          }
        }
        entryCounts.set(filePath, logs.length);
      } catch (err) {
        onError?.(err as Error);
      }
    };

    try {
      const files = readdirSync(dir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const filePath = join(dir, file);
        try {
          const content = readFileSync(filePath, 'utf-8');
          const data = JSON.parse(content);
          const logs = Array.isArray(data) ? data : (data.entries || []);
          entryCounts.set(filePath, logs.length);
        } catch {
          entryCounts.set(filePath, 0);
        }
      }
    } catch {
    }

    const watcher = watch(dir, (_eventType, filename) => {
      if (!filename || !filename.toString().endsWith('.json')) return;
      const filePath = join(dir, filename.toString());
      if (!existsSync(filePath)) return;
      readNewEntries(filePath);
    });

    return {
      stop: () => {
        watcher.close();
      },
    };
  }

  private normalizeEntry(entry: any): LogEntry {
    return {
      timestamp: entry.timestamp || entry.time || '',
      agentId: entry.agentId || entry.agent || '',
      action: entry.action || entry.type || '',
      details: entry.details || entry.message || '',
      metadata: entry.metadata || {},
    };
  }

  private matchesFilter(entry: any, filter: LogFilter): boolean {
    const entryAgent = entry.agentId || entry.agent || '';
    const entryTime = entry.timestamp || entry.time || '';
    if (filter.agent && !entryAgent.includes(filter.agent)) return false;
    if (filter.since && entryTime < filter.since) return false;
    return true;
  }
}
