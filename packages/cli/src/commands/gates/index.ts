import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function GatesCommand() {
  const cmd = new Command('gates').description('Quality gates operations');

  cmd.command('list')
    .description('List all quality gates')
    .action(async (_opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const current = c.stateMachine.getCurrentState();
      const history = c.stateMachine.getHistory();
      const logs = c.logReader.readLogs({ lines: 100 });
      const context = { currentState: current.currentState, history: history as any, logs: logs as any };
      const gates = (c as any).qualityGateEngine?.evaluate([], context) ?? [];
      r.table(gates.length > 0 ? gates : [{ gateId: '(no gates evaluated)', status: '—' }], { caption: 'Quality Gates' });
    });

  return cmd;
}
