import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function DoctorCommand() {
  const cmd = new Command('doctor').description('Diagnose and fix system issues');

  cmd.command('diagnose')
    .description('Run system diagnosis')
    .action(async (_opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const issues = c.doctor.diagnose() as any[];

      if (issues.length === 0) {
        r.success('No issues found.');
        return;
      }

      r.info(`Found ${issues.length} issue(s):`);
      for (const issue of issues) {
        const color = issue.severity === 'critical' || issue.severity === 'high' ? 'error' as const
          : issue.severity === 'medium' ? 'warning' as const
          : 'muted' as const;
        r.card({
          title: `[${issue.severity.toUpperCase()}] ${issue.category}`,
          color,
          fields: [
            { label: 'Message', value: issue.message },
            { label: 'Suggestion', value: issue.suggestion ?? '—' },
            { label: 'Auto-fixable', value: issue.autoFixable ? 'Yes' : 'No' },
          ],
          footer: `akoris doctor fix ${issue.id}`,
        });
      }
    });

  cmd.command('fix')
    .description('Fix system issues')
    .argument('[issueIds...]', 'Issue IDs to fix (omit for all)')
    .action(async (issueIds: string[], _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const result = c.doctor.fix(issueIds.length > 0 ? issueIds : undefined) as any;
      r.success(`Fixed: ${result.fixed.length}, Failed: ${result.failed.length}`);
    });

  return cmd;
}
