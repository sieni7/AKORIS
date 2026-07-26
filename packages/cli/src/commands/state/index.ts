import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function StateCommand() {
  const cmd = new Command('state').description('State machine operations');

  cmd.command('show')
    .description('Show current state')
    .action(async (_opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const current = c.stateMachine.getCurrentState();
      const machine = c.stateMachine.loadMachine() as any;

      r.card({
        title: 'State Machine',
        fields: [
          { label: 'Current State', value: current.currentState, color: 'primary' },
          { label: 'Version', value: machine.version },
          { label: 'Total States', value: String(machine.states?.length ?? 0) },
          { label: 'Total Transitions', value: String(machine.transitions?.length ?? 0) },
        ],
      });

      const available = (machine.transitions ?? []).filter((t: any) => t.from === current.currentState);
      if (available.length > 0) {
        r.info('Available transitions:');
        r.table(available.map((t: any) => ({ To: t.to, Gates: (t.requiredGates ?? []).join(', '), Description: t.description })));
      }
    });

  cmd.command('graph')
    .description('Show state machine graph')
    .action(async (_opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const machine = c.stateMachine.loadMachine() as any;
      const current = c.stateMachine.getCurrentState();
      const states: string[] = (machine.states ?? []).map((s: any) => s.id ?? s.name ?? s);
      const transitions: { from: string; to: string }[] = (machine.transitions ?? []).map((t: any) => ({ from: t.from, to: t.to }));

      for (const s of states) {
        const marker = s === current.currentState ? '●' : '○';
        r.info(`${marker} ${s}${s === current.currentState ? ' (current)' : ''}`);
      }
      r.info('Transitions:');
      for (const t of transitions) {
        r.write({ from: t.from, to: t.to });
      }
    });

  cmd.command('transition')
    .description('Execute a state transition')
    .argument('<from>', 'source state')
    .argument('<to>', 'target state')
    .option('--comment <text>', 'transition comment')
    .action(async (from: string, to: string, opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      try {
        const result = c.stateMachine.transition(from, to, 'cli', opts.comment) as any;
        if (result.success) {
          r.success(`Transitioned: ${from} → ${to}`);
          if (result.gatesStatus) r.table(result.gatesStatus, { caption: 'Quality Gates' });
        }
      } catch (err: any) {
        r.error(`Transition failed: ${err.message}`);
      }
    });

  cmd.command('history')
    .description('Show transition history')
    .option('--limit <n>', 'max entries', parseInt)
    .action(async (opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const history = c.stateMachine.getHistory() as any[];
      if (history.length === 0) { r.info('No transitions yet.'); return; }

      const entries = opts.limit ? history.slice(-opts.limit) : history;
      r.timeline(entries.reverse().map((h: any) => ({
        timestamp: new Date(h.at).toLocaleString(),
        label: `${h.from} → ${h.to} (by ${h.authorizedBy})`,
        color: 'primary' as const,
      })));
    });

  return cmd;
}
