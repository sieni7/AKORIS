import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function SecretsCommand() {
  const cmd = new Command('secrets').description('Secret management');

  cmd.command('set')
    .description('Store a secret')
    .argument('<key>', 'secret key')
    .argument('<value>', 'secret value')
    .action(async (key: string, value: string, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      c.secrets.setSecret(key, value);
      r.success(`Secret '${key}' saved.`);
    });

  cmd.command('get')
    .description('Get a secret value')
    .argument('<key>', 'secret key')
    .action(async (key: string, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      try {
        const secret = c.secrets.getSecret(key);
        r.card({ title: key, fields: [{ label: 'Value', value: secret.value }] });
      } catch { r.error(`Secret '${key}' not found.`); }
    });

  cmd.command('rm')
    .description('Delete a secret')
    .argument('<key>', 'secret key')
    .action(async (key: string, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      c.secrets.removeSecret(key);
      r.success(`Secret '${key}' removed.`);
    });

  cmd.command('ls')
    .description('List secret keys')
    .action(async (_opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const keys = c.secrets.listSecrets();
      if (keys.length === 0) { r.info('No secrets stored.'); return; }
      r.table(keys.map((k: string) => ({ Key: k })));
    });

  return cmd;
}
