import { Command } from 'commander';
import type { IRenderer, TreeNode } from '../../output/renderer.js';
import type { CoreService } from '../../services/core-factory.js';

export function RegistryCommand() {
  const cmd = new Command('registry').description('Agent registry operations');

  cmd.command('list')
    .description('List agents')
    .option('--domain <domain>', 'filter by domain')
    .option('--status <status>', 'filter by status')
    .action(async (opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const result = c.registry.listAgents({ domain: opts.domain, status: opts.status }) as any;
      const agents: any[] = result.agents ?? [];

      if (agents.length === 0) { r.info('No agents found.'); return; }

      const domains = [...new Set(agents.map((a: any) => a.domain))].sort();
      const tree: TreeNode = { label: `Agents (${agents.length})`, children: [] };
      for (const domain of domains) {
        const domainAgents = agents.filter((a: any) => a.domain === domain);
        tree.children!.push({
          label: domain,
          children: domainAgents.map((a: any) => ({
            label: `${a.status === 'active' ? '✓' : '○'} ${a.id}  ${a.name}  v${a.version}`,
            meta: { status: a.status, criticity: a.criticity },
          })),
        });
      }
      r.tree(tree);
    });

  cmd.command('get')
    .description('Get agent details')
    .argument('<id>', 'Agent ID')
    .action(async (id: string, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      try {
        const agent = c.registry.loadAgent(id) as any;
        r.card({
          title: agent.name,
          subtitle: `${agent.id} · v${agent.version}`,
          color: agent.status === 'active' ? 'success' : 'muted',
          fields: [
            { label: 'Domain', value: agent.domain },
            { label: 'Status', value: agent.status, color: agent.status === 'active' ? 'success' : 'warning' },
            { label: 'Criticity', value: agent.criticity, color: agent.criticity === 'critique' ? 'error' : 'muted' },
            { label: 'Description', value: agent.description },
            { label: 'Tags', value: (agent.tags ?? []).join(', ') || '—' },
          ],
        });

        if (agent.capabilities?.length > 0) {
          r.info('Capabilities:');
          for (const cap of agent.capabilities) {
            r.card({
              title: cap.name,
              color: cap.type === 'can' ? 'success' : 'error',
              fields: [{ label: 'Description', value: cap.description }],
            });
          }
        }

        if (agent.dependencies?.length > 0) {
          r.info('Dependencies:');
          const depRows = agent.dependencies.map((d: any) => ({
            Agent: d.agentId,
            Type: d.type,
            Description: d.description ?? '',
          }));
          r.table(depRows, { caption: 'Required agents' });
        }
      } catch {
        r.error(`Agent '${id}' not found.`);
      }
    });

  cmd.command('search')
    .description('Search agents')
    .argument('<query>', 'Search query')
    .option('--type <type>', 'filter by type (agent|capability|tag)')
    .option('--limit <n>', 'max results', parseInt)
    .action(async (query: string, opts, _cmd) => {
      const renderer = (cmd as any).__renderer as IRenderer;
      const core = (cmd as any).__core as CoreService;
      const cmdCtx = _cmd as any;
      const r = cmdCtx.__renderer ?? renderer;
      const c = cmdCtx.__core ?? core;
      const result = c.searchEngine.search({ q: query, type: opts.type, limit: opts.limit ?? 20 }) as any;
      if (result.count === 0) { r.info('No results.'); return; }
      r.table(result.agents, { caption: `${result.count} result(s) for "${query}"` });
    });

  return cmd;
}
