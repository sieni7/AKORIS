import type { RegistryReader } from './registry-reader.js';
import type { StateMachineEngine } from './state-machine.js';
import type { LogReader } from './log-reader.js';
import { NotFoundError } from './errors.js';
import type { PromptTemplate, PromptVariableDef, ResolvedPrompt, LLMRequest, LLMResponse } from './types.js';

function generateId(): string {
  return `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseVariables(template: string): PromptVariableDef[] {
  const vars: PromptVariableDef[] = [];
  const regex = /\{\{(\w+):(\w+)\}\}/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    const [, source, key] = match;
    const composite = `${source}:${key}`;
    if (!vars.some(v => v.key === composite)) {
      vars.push({
        key: composite,
        label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        source: source as PromptVariableDef['source'],
        required: true,
      });
    }
  }
  return vars;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export class PromptEngine {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor(
    private registry: RegistryReader,
    private stateMachine: StateMachineEngine,
    private logReader: LogReader,
  ) {}

  createTemplate(name: string, description: string, template: string, tags: string[] = []): PromptTemplate {
    const now = new Date().toISOString();
    const id = generateId();
    const variables = parseVariables(template);
    const pt: PromptTemplate = {
      id, name, description, tags, template, variables,
      createdAt: now, updatedAt: now,
    };
    this.templates.set(id, pt);
    return pt;
  }

  updateTemplate(id: string, data: Partial<Omit<PromptTemplate, 'id' | 'createdAt'>>): PromptTemplate {
    const existing = this.templates.get(id);
    if (!existing) throw new NotFoundError('PromptTemplate', id);
    const now = new Date().toISOString();
    const template = data.template ?? existing.template;
    const variables = data.template ? parseVariables(template) : existing.variables;
    const updated: PromptTemplate = {
      ...existing, ...data, variables,
      updatedAt: now, id: existing.id, createdAt: existing.createdAt,
    };
    this.templates.set(id, updated);
    return updated;
  }

  deleteTemplate(id: string): void {
    if (!this.templates.has(id)) throw new NotFoundError('PromptTemplate', id);
    this.templates.delete(id);
  }

  getTemplate(id: string): PromptTemplate {
    const t = this.templates.get(id);
    if (!t) throw new NotFoundError('PromptTemplate', id);
    return t;
  }

  listTemplates(filter?: { search?: string; tag?: string }): PromptTemplate[] {
    let list = Array.from(this.templates.values());
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (filter?.tag) {
      list = list.filter(t => t.tags.includes(filter.tag!));
    }
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  resolveTemplate(id: string, context?: { agentId?: string }): ResolvedPrompt {
    const t = this.getTemplate(id);
    let resolved = t.template;
    const resolvedVars: Record<string, string> = {};

    const replaceVar = (key: string, val: string) => {
      const regex = new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, 'g');
      resolved = resolved.replace(regex, val);
      resolvedVars[key] = val;
    };

    if (t.variables.some(v => v.source === 'agent')) {
      if (context?.agentId) {
        try {
          const agent = this.registry.loadAgent(context.agentId);
          replaceVar('agent:name', agent.name);
          replaceVar('agent:description', agent.description);
          replaceVar('agent:domain', agent.domain);
          replaceVar('agent:version', agent.version);
          replaceVar('agent:status', agent.status);
          replaceVar('agent:criticity', agent.criticity);
          replaceVar('agent:capabilities', agent.capabilities.map(c => `- ${c.name}: ${c.description}`).join('\n'));
          replaceVar('agent:dependencies', agent.dependencies.map(d => `- ${d.agentId} (${d.type})`).join('\n'));
        } catch {
          resolved = resolved.replace(/\{\{agent:\w+\}\}/g, '[agent not found]');
        }
      } else {
        resolved = resolved.replace(/\{\{agent:\w+\}\}/g, '[no agent selected]');
      }
    }

    if (t.variables.some(v => v.source === 'state')) {
      const current = this.stateMachine.getCurrentState();
      const history = this.stateMachine.getHistory();
      const machine = this.stateMachine.loadMachine();
      replaceVar('state:current', current.currentState);
      replaceVar('state:version', machine.version);
      replaceVar('state:history', history.slice(-5).map(h => `- ${h.from} → ${h.to} (${new Date(h.at).toLocaleString()})`).join('\n'));
      replaceVar('state:states', machine.states.map(s => `- ${s.id}: ${s.name} (${s.phase})`).join('\n'));
    }

    if (t.variables.some(v => v.source === 'logs')) {
      const logs = this.logReader.readLogs({ lines: 15 });
      replaceVar('logs:recent', logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.agent}: ${l.message}`).join('\n'));
      replaceVar('logs:count', String(logs.length));
    }

    if (t.variables.some(v => v.source === 'system')) {
      replaceVar('system:version', '1.0.0');
      replaceVar('system:timestamp', new Date().toISOString());
    }

    resolved = resolved.replace(/\{\{\w+:\w+\}\}/g, '[unresolved]');

    return {
      templateId: id,
      templateName: t.name,
      original: t.template,
      resolved,
      variables: resolvedVars,
      tokenEstimate: estimateTokens(resolved),
    };
  }

  async evaluate(request: LLMRequest): Promise<LLMResponse> {
    const start = performance.now();
    const promptTokens = estimateTokens(request.prompt);

    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const latencyMs = Math.round(performance.now() - start);
    const lines = request.prompt.split('\n').filter(l => l.trim());
    const hasQuestion = request.prompt.includes('?');

    let content = '';
    if (hasQuestion) {
      content = `Based on the provided system context, here is my analysis:\n\n`;
      const stateMatch = request.prompt.match(/(ideation|development|review|staging|production)/i);
      if (stateMatch) content += `The current project state is **${stateMatch[0]}**. `;
      content += `The agent's capabilities align with the requested task.\n\nRecommended actions:\n1. Validate the requirements against the agent's contract\n2. Check quality gates for the current phase\n3. Execute the transition if all conditions are met`;
    } else {
      content = `System context loaded successfully.\n\n`;
      const agentMatch = request.prompt.match(/Agent:\s*(.+)/);
      if (agentMatch) content += `- Target agent: ${agentMatch[1].trim()}\n`;
      content += `- State machine: operational\n`;
      content += `- Registry: available\n`;
      if (lines.length > 3) content += `- Context: ${lines.length} lines parsed\n`;
      content += `\nThe prompt has been contextualized with live system data. All variables resolved.`;
    }

    const completionTokens = estimateTokens(content);
    const totalTokens = promptTokens + completionTokens;
    const cost = Math.round((totalTokens / 1_000_000) * 3 * 100000) / 100000;

    return {
      content,
      model: request.model ?? 'mock-llm-v1',
      usage: { promptTokens, completionTokens, totalTokens },
      cost,
      latencyMs,
      timestamp: new Date().toISOString(),
    };
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
