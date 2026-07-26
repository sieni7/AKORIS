import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RegistryReaderV2 } from './registry-reader-v2.service.js';
import { LogReader } from './log-reader.service.js';

export interface SearchResult {
  type: 'agent' | 'rule' | 'adr' | 'log' | 'capability' | 'deliverable' | 'event';
  id: string;
  name: string;
  description: string;
  tags: string[];
  matchField: string;
  matchValue: string;
  source: string;
}

export interface SearchOptions {
  types?: string[];
}

export class SearchEngine {
  private reader: RegistryReaderV2;

  constructor(reader?: RegistryReaderV2) {
    this.reader = reader || new RegistryReaderV2();
  }

  search(query: string, opts: SearchOptions = {}): SearchResult[] {
    if (!query || query.length < 1) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];
    const typeFilter = opts.types ? opts.types.map(t => t.toLowerCase()) : null;

    const addIfType = (type: string): boolean => {
      return !typeFilter || typeFilter.includes(type);
    };

    if (addIfType('agent')) {
      results.push(...this.searchAgents(q));
    }
    if (addIfType('rule')) {
      results.push(...this.searchRules(q));
    }
    if (addIfType('capability')) {
      results.push(...this.searchCapabilities(q));
    }
    if (addIfType('deliverable')) {
      results.push(...this.searchDeliverables(q));
    }
    if (addIfType('event')) {
      results.push(...this.searchEvents(q));
    }
    if (addIfType('adr')) {
      results.push(...this.searchADRs(q));
    }
    if (addIfType('log')) {
      results.push(...this.searchLogs(q));
    }

    results.sort((a, b) => {
      const typeOrder: Record<string, number> = { agent: 0, rule: 1, capability: 2, deliverable: 3, event: 4, adr: 5, log: 6 };
      return (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
    });

    return results;
  }

  private searchAgents(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    const dirs = this.reader.listAgentDirs();

    for (const dir of dirs) {
      const agent = this.reader.readAgentJson<Record<string, unknown>>(dir, 'agent.json');
      if (!agent) continue;

      const id = String(agent.id || '');
      const name = String(agent.name || '');
      const domain = String(agent.domain || '');
      const tags: string[] = Array.isArray(agent.tags) ? agent.tags.map(String) : [];
      const status = String(agent.status || '');
      const criticity = String(agent.criticity || '');

      const fields: Record<string, string> = { id, name, domain };
      if (tags.length) fields.tags = tags.join(' ');
      if (status) fields.status = status;
      if (criticity) fields.criticity = criticity;

      for (const [field, value] of Object.entries(fields)) {
        if (value.toLowerCase().includes(q)) {
          results.push({
            type: 'agent', id, name, description: domain,
            tags, matchField: field, matchValue: value, source: `registry/agents/${dir}/`,
          });
          break;
        }
      }
    }

    return results;
  }

  private searchRules(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    const rules = this.reader.getRules();

    for (const rule of rules) {
      const id = rule.id || '';
      const name = rule.name || '';
      const r = rule as unknown as Record<string, unknown>;
      const description = String(r.description || '');
      const severity = String(r.severity || '');
      const tags: string[] = Array.isArray(r.tags) ? r.tags.map(String) : [];
      const ifClause = rule.if || '';
      const thenClause = rule.then || '';

      const fields: Record<string, string> = { id, name, description, severity, if: ifClause, then: thenClause };
      if (tags.length) fields.tags = tags.join(' ');

      for (const [field, value] of Object.entries(fields)) {
        if (value.toLowerCase().includes(q)) {
          results.push({
            type: 'rule', id, name, description,
            tags, matchField: field, matchValue: value,
            source: `registry/rules/${id}.json`,
          });
          break;
        }
      }
    }

    return results;
  }

  private searchCapabilities(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    const caps = this.reader.getCapabilityRegistry();
    if (!caps?.capabilities) return results;

    for (const [capId, agents] of Object.entries(caps.capabilities)) {
      if (capId.toLowerCase().includes(q)) {
        results.push({
          type: 'capability', id: capId, name: capId, description: '',
          tags: agents, matchField: 'id', matchValue: capId,
          source: `registry/capabilities.json`,
        });
      }
    }

    return results;
  }

  private searchDeliverables(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    const deliverables = this.reader.getDeliverables();

    for (const d of deliverables) {
      const id = d.id || '';
      const name = d.name || '';
      const type = d.type || '';
      const producedBy: string[] = Array.isArray(d.producedBy) ? d.producedBy.map(String) : [];
      const consumedBy: string[] = Array.isArray(d.consumedBy) ? d.consumedBy.map(String) : [];

      const fields: Record<string, string> = { id, name, type };
      if (producedBy.length) fields.producedBy = producedBy.join(' ');
      if (consumedBy.length) fields.consumedBy = consumedBy.join(' ');

      for (const [field, value] of Object.entries(fields)) {
        if (value.toLowerCase().includes(q)) {
          results.push({
            type: 'deliverable', id, name, description: type,
            tags: [...producedBy, ...consumedBy],
            matchField: field, matchValue: value,
            source: `registry/deliverables/`,
          });
          break;
        }
      }
    }

    return results;
  }

  private searchEvents(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    const events = this.reader.getEvents();

    for (const evt of events) {
      const id = evt.id || '';
      const name = evt.name || '';
      const description = evt.description || '';
      const triggers: string[] = Array.isArray(evt.triggers) ? evt.triggers.map(String) : [];

      const fields: Record<string, string> = { id, name, description };
      if (triggers.length) fields.triggers = triggers.join(' ');

      for (const [field, value] of Object.entries(fields)) {
        if (value.toLowerCase().includes(q)) {
          results.push({
            type: 'event', id, name, description,
            tags: triggers, matchField: field, matchValue: value,
            source: `registry/events/`,
          });
          break;
        }
      }
    }

    return results;
  }

  private searchADRs(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    const decisionsDir = join(process.cwd(), '.akoris', 'decisions');
    if (!existsSync(decisionsDir)) return results;

    const files = readdirSync(decisionsDir).filter(f => f.endsWith('.md'));
    if (!files.length) return results;

    for (const file of files) {
      try {
        const content = readFileSync(join(decisionsDir, file), 'utf-8');
        const lower = content.toLowerCase();
        if (!lower.includes(q)) continue;

        const lines = content.split('\n');
        const titleLine = lines.find(l => l.startsWith('# ')) || '';
        const title = titleLine.replace(/^#\s*/, '') || file.replace('.md', '');

        const statusLine = lines.find(l => l.startsWith('- **Statut**') || l.startsWith('- Status') || l.includes('Statut'));
        const status = statusLine ? statusLine.split(':').pop()?.trim() || '' : '';

        results.push({
          type: 'adr', id: file.replace('.md', ''), name: title,
          description: status ? `Statut: ${status}` : '',
          tags: [], matchField: 'content', matchValue: content.substring(0, 200),
          source: `.akoris/decisions/${file}`,
        });
      } catch {
        continue;
      }
    }

    return results;
  }

  private searchLogs(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    const logsDir = join(process.cwd(), '.akoris', 'logs', 'sessions');
    if (!existsSync(logsDir)) return results;

    const files = readdirSync(logsDir).filter(f => f.endsWith('.json'));
    if (!files.length) return results;

    for (const file of files) {
      try {
        const content = readFileSync(join(logsDir, file), 'utf-8');
        const data = JSON.parse(content);
        const entries = Array.isArray(data) ? data : (data.entries || []);
        for (const entry of entries) {
          const agentId = entry.agentId || entry.agent || '';
          const action = entry.action || entry.type || '';
          const details = entry.details || entry.message || '';
          const timestamp = entry.timestamp || entry.time || '';

          const fields: Record<string, string> = { agentId, action, details };
          for (const [field, value] of Object.entries(fields)) {
            if (value.toLowerCase().includes(q)) {
              results.push({
                type: 'log', id: `${file}:${timestamp}`, name: `[${timestamp}] ${agentId}`,
                description: `${action}: ${details}`,
                tags: [], matchField: field, matchValue: value,
                source: `.akoris/logs/sessions/${file}`,
              });
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }

    return results;
  }
}
