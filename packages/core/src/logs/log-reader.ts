import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { LogEntry, LogFilter } from '@akoris/shared';

export class LogReader {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async readLogs(filter?: LogFilter): Promise<LogEntry[]> {
    const logsDir = join(this.projectRoot, '.akoris', 'logs', 'sessions');
    let entries: LogEntry[] = [];

    try {
      const files = await readdir(logsDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      for (const file of jsonFiles) {
        const content = await readFile(join(logsDir, file), 'utf-8');
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
        } catch (_) {
          // ignorer les fichiers malformés
        }
      }
    } catch (_) {
      // dossier logs manquant
    }

    entries.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    if (filter?.lines && filter.lines > 0) {
      entries = entries.slice(0, filter.lines);
    }

    return entries;
  }

  private matchesFilter(entry: any, filter?: LogFilter): boolean {
    if (!filter) return true;
    const entryAgent = entry.agentId || entry.agent || '';
    const entryTime = entry.timestamp || entry.time || '';
    if (filter.agent && !entryAgent.includes(filter.agent)) return false;
    if (filter.since && entryTime < filter.since) return false;
    return true;
  }
}
