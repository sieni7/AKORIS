import { readFileSync, readdirSync } from 'node:fs';
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
              entries.push({
                timestamp: entry.timestamp || entry.time || '',
                agentId: entry.agentId || entry.agent || '',
                action: entry.action || entry.type || '',
                details: entry.details || entry.message || '',
                metadata: entry.metadata || {},
              });
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

  private matchesFilter(entry: any, filter: LogFilter): boolean {
    const entryAgent = entry.agentId || entry.agent || '';
    const entryTime = entry.timestamp || entry.time || '';
    if (filter.agent && !entryAgent.includes(filter.agent)) return false;
    if (filter.since && entryTime < filter.since) return false;
    return true;
  }
}
