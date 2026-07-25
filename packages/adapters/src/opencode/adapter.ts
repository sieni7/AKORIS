import { BaseAdapter, type AdapterContext, type AdapterResult } from '../index.js';

export class OpenCodeAdapter extends BaseAdapter {
  constructor() {
    super('opencode', 'OpenCode');
  }

  async translate(context: AdapterContext): Promise<AdapterResult> {
    try {
      const prompt = this.buildPrompt(context);
      return {
        success: true,
        output: { prompt, engine: 'opencode' },
        metadata: { adapter: 'opencode', version: '1.0.0' },
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'OpenCode adapter error',
      };
    }
  }

  private buildPrompt(context: AdapterContext): string {
    return [
      `# AKORIS - Agent: ${context.agentId}`,
      `# Contrat: ${context.contractId}`,
      '',
      '## Policies applicables',
      ...context.policies.map(p => `- ${p}`),
      '',
      '## Contexte',
      JSON.stringify(context.inputs, null, 2),
      '',
      '## Instructions',
      'Respecte les policies AKORIS listées ci-dessus.',
      'Produis un livrable conforme au contrat.',
    ].join('\n');
  }
}
