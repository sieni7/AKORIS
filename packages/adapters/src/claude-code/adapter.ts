import { BaseAdapter, type AdapterContext, type AdapterResult } from '../index.js';

export class ClaudeCodeAdapter extends BaseAdapter {
  constructor() {
    super('claude-code', 'Claude Code');
  }

  async translate(context: AdapterContext): Promise<AdapterResult> {
    try {
      const session = this.buildSession(context);
      return {
        success: true,
        output: { session, engine: 'claude-code' },
        metadata: { adapter: 'claude-code', version: '1.0.0' },
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Claude Code adapter error',
      };
    }
  }

  private buildSession(context: AdapterContext): string {
    return [
      '<akoris-session>',
      `  <agent>${context.agentId}</agent>`,
      `  <contract>${context.contractId}</contract>`,
      '  <policies>',
      ...context.policies.map(p => `    <policy>${p}</policy>`),
      '  </policies>',
      '  <context>',
      `    ${JSON.stringify(context.inputs)}`,
      '  </context>',
      '</akoris-session>',
    ].join('\n');
  }
}
