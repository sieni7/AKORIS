import type { LogEntry } from './types.js';

export interface LogFilter {
  lines?: number;
  agent?: string;
  level?: string;
  since?: string;
}

export class LogReader {
  private logs: LogEntry[] = [];

  constructor(seedLogs?: LogEntry[]) {
    if (seedLogs) this.logs = [...seedLogs];
  }

  append(entry: LogEntry): void {
    this.logs.push(entry);
  }

  readLogs(filter?: LogFilter): LogEntry[] {
    let result = [...this.logs];

    if (filter?.agent) {
      result = result.filter((l) => l.agent === filter.agent);
    }
    if (filter?.level) {
      result = result.filter((l) => l.level === filter.level);
    }
    if (filter?.since) {
      const sinceDate = new Date(filter.since);
      result = result.filter((l) => new Date(l.timestamp) >= sinceDate);
    }

    const lines = filter?.lines ?? 100;
    return result.slice(-lines);
  }
}
