import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function LogsCommand() {
  const cmd = new Command('logs').description('View system logs');

  cmd.command('show')
    .description('Show recent logs')
    .option('--level <level>', 'filter by level (info, warn, error, debug)')
    .option('--agent <agent>', 'filter by agent ID')
    .option('--lines <n>', 'number of lines', parseInt)
    .action(async (opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const logs = c.logReader.readLogs({ lines: opts.lines ?? 50, level: opts.level, agent: opts.agent }) as any[];

      if (logs.length === 0) { r.info('No logs match the current filters.'); return; }

      r.timeline(logs.reverse().map((entry: any) => ({
        timestamp: new Date(entry.timestamp).toLocaleTimeString(),
        label: `[${entry.level.toUpperCase()}] ${entry.agent}: ${entry.message}`,
        color: entry.level === 'error' ? 'error' as const
          : entry.level === 'warn' ? 'warning' as const
          : 'muted' as const,
      })));
    });

  cmd.command('watch')
    .description('Watch logs in real time (requires EventBus)')
    .option('--level <level>', 'filter by level')
    .option('--agent <agent>', 'filter by agent')
    .action(async (_opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      r.info('Watching logs... (press Ctrl+C to stop)');
      r.warning('EventBus not available. Polling every 2s as fallback.');

      const interval = setInterval(() => {
        const logs = c.logReader.readLogs({ lines: 5 }) as any[];
        for (const entry of logs) {
          const color = entry.level === 'error' ? 'error' as const
            : entry.level === 'warn' ? 'warning' as const
            : 'muted' as const;
          r.timeline([{
            timestamp: new Date(entry.timestamp).toLocaleTimeString(),
            label: `[${entry.level.toUpperCase()}] ${entry.agent}: ${entry.message}`,
            color,
          }]);
        }
      }, 2000);

      process.on('SIGINT', () => { clearInterval(interval); process.exit(0); });
    });

  return cmd;
}
