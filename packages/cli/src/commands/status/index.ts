import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';
import { icons } from '../../ui/icons.js';

export function StatusCommand() {
  return new Command('status')
    .description('Show system health and status')
    .option('--score', 'show numeric health score only')
    .action(async (opts, cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;

      if (opts.score) {
        const issues = core.doctor.diagnose();
        const score = Math.max(0, 100 - issues.length * 10);
        renderer.write({ score, issues: issues.length });
        return;
      }

      const health = { status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() };
      const idx = core.registry.loadIndex();
      const issues = core.doctor.diagnose();
      const current = core.stateMachine.getCurrentState();

      renderer.card({
        title: 'System Health',
        color: issues.length === 0 ? 'success' : 'warning',
        fields: [
          { label: 'API Status', value: `${icons.success} ${health.status}` },
          { label: 'Version', value: health.version },
          { label: 'Agents', value: `${idx.agentCount} (${idx.domains.length} domains)` },
          { label: 'Current State', value: current.currentState },
          { label: 'Doctor Issues', value: String(issues.length) },
        ],
      });

      if (issues.length > 0) {
        renderer.warning(`${issues.length} issue(s) found. Run \`akoris doctor diagnose\` for details.`);
      }
    });
}
