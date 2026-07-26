export interface Prompt {
  id: string; // UUID
  name: string;
  template: string;
  agentId: string; // Agent ID
  context: PromptContext;
  variables: Record<string, string>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    llmProvider?: string;
    tokens?: number;
  };
}

export interface PromptContext {
  includeRegistry: boolean;
  includeADR: boolean;
  includeState: boolean;
  includeLogs: boolean;
  includeStandards: boolean;
  includeArchitecture: boolean;
  includeSprint: boolean;
  custom?: Record<string, unknown>;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  defaultContext: PromptContext;
  tags: string[];
}

export interface LLMProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  model: string;
  maxTokens: number;
  costPer1kTokens: number;
}

export interface PromptExecution {
  id: string;
  promptId: string;
  provider: string;
  input: string;
  output: string;
  tokensUsed: number;
  cost: number;
  durationMs: number;
  timestamp: string;
  status: 'success' | 'error';
}
