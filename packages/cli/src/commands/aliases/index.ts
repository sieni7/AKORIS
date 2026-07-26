import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function AliasesCommand() {
  const cmd = new Command('aliases').description('Alias management (raccourcis)');

  cmd.command('set')
    .description('Create an alias')
    .argument('<name>')
    .argument('<command>')
    .action(async (name: string, command: string, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      c.aliases.setAlias({ name, command, description: '' });
      r.success(`Alias '${name}' → ${command}`);
    });

  cmd.command('get')
    .description('Show an alias')
    .argument('<name>')
    .action(async (name: string, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      try {
        const alias = c.aliases.getAlias(name) as any;
        r.card({ title: name, fields: [{ label: 'Command', value: alias.command }, { label: 'Description', value: alias.description || '—' }] });
      } catch { r.error(`Alias '${name}' not found.`); }
    });

  cmd.command('rm')
    .description('Delete an alias')
    .argument('<name>')
    .action(async (name: string, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      c.aliases.removeAlias(name);
      r.success(`Alias '${name}' removed.`);
    });

  cmd.command('ls')
    .description('List all aliases')
    .action(async (_opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const aliases = c.aliases.listAliases() as any[];
      if (aliases.length === 0) { r.info('No aliases defined.'); return; }
      r.table(aliases.map((a: any) => ({ Name: a.name, Command: a.command, Description: a.description || '' })));
    });

  return cmd;
}
