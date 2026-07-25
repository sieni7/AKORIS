import { BaseAdapter, type AdapterContext, type AdapterResult } from '../index.js';

export class CursorAdapter extends BaseAdapter {
  constructor() {
    super('cursor', 'Cursor');
  }

  async translate(context: AdapterContext): Promise<AdapterResult> {
    try {
      const rules = this.buildRules(context);
      return {
        success: true,
        output: { rules, engine: 'cursor' },
        metadata: { adapter: 'cursor', version: '1.0.0' },
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Cursor adapter error',
      };
    }
  }

  private buildRules(context: AdapterContext): string[] {
    return [
      `# AKORIS Rules for Cursor`,
      `# Agent: ${context.agentId}`,
      `# Contract: ${context.contractId}`,
      '',
      ...context.policies.map(p => `- @akoris-rule: ${p}`),
    ];
  }
}
