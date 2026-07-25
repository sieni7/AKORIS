import { BaseAdapter, type AdapterContext, type AdapterResult } from '../index.js';

export class CodexAdapter extends BaseAdapter {
  constructor() {
    super('codex', 'Codex');
  }

  async translate(context: AdapterContext): Promise<AdapterResult> {
    try {
      const instructions = this.buildInstructions(context);
      return {
        success: true,
        output: { instructions, engine: 'codex' },
        metadata: { adapter: 'codex', version: '1.0.0' },
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Codex adapter error',
      };
    }
  }

  private buildInstructions(context: AdapterContext): Record<string, unknown> {
    return {
      system_prompt: `You are an AKORIS agent (${context.agentId}) following contract ${context.contractId}.`,
      policies: context.policies,
      context: context.inputs,
      constraints: ['zero_hallucination', 'zero_spaghetti'],
    };
  }
}
