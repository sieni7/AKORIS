import { Command } from 'commander';
import type { IRenderer } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function PromptsCommand() {
  const cmd = new Command('prompts').description('Prompt library (AI Studio)');

  cmd.command('list')
    .description('List prompt templates')
    .option('--tag <tag>', 'filter by tag')
    .action(async (opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const templates = c.prompts.listTemplates({ tag: opts.tag }) as any[];
      if (templates.length === 0) { r.info('No templates found.'); return; }
      r.table(templates.map((t: any) => ({ ID: t.id, Name: t.name, Tags: (t.tags ?? []).join(', '), Variables: t.variables?.length ?? 0 })));
    });

  cmd.command('create')
    .description('Create a new prompt template')
    .argument('<name>')
    .argument('<description>')
    .argument('<template>')
    .option('--tags <tags>', 'comma-separated tags')
    .action(async (name: string, description: string, template: string, opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const tags = opts.tags ? opts.tags.split(',').map((t: string) => t.trim()) : undefined;
      const result = c.prompts.createTemplate(name, description, template, tags) as any;
      r.success(`Template '${result.id}' created.`);
    });

  cmd.command('resolve')
    .description('Resolve a template with live context')
    .argument('<id>')
    .option('--agent <id>', 'agent ID for context')
    .action(async (id: string, opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      try {
        const resolved = c.prompts.resolveTemplate(id, { agentId: opts.agent }) as any;
        r.card({ title: resolved.templateName ?? id, fields: [{ label: 'Resolved', value: resolved.resolved }] });
        if (resolved.variables) r.table(Object.entries(resolved.variables).map(([k, v]) => ({ Variable: k, Value: v as string })), { caption: 'Variables' });
      } catch { r.error(`Template '${id}' not found.`); }
    });

  cmd.command('evaluate')
    .description('Evaluate a resolved prompt with mock LLM')
    .argument('<id>')
    .option('--agent <id>', 'agent ID for context')
    .action(async (id: string, opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      try {
        const resolved = c.prompts.resolveTemplate(id, { agentId: opts.agent }) as any;
        r.info('Evaluating...');
        const response = await c.prompts.evaluate({ prompt: resolved.resolved }) as any;
        r.card({ title: 'LLM Response', fields: [
          { label: 'Model', value: response.model },
          { label: 'Content', value: response.content },
          { label: 'Latency', value: `${response.latencyMs}ms` },
          { label: 'Tokens', value: `${response.usage?.totalTokens ?? '?'}` },
        ]});
      } catch { r.error(`Template '${id}' not found.`); }
    });

  return cmd;
}
