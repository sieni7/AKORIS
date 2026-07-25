export interface AdapterContract {
  name: string;
  engine: string;
  translate(context: AdapterContext): Promise<AdapterResult>;
}

export interface AdapterContext {
  agentId: string;
  contractId: string;
  inputs: Record<string, unknown>;
  policies: string[];
  registryPath?: string;
}

export interface AdapterResult {
  success: boolean;
  output?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export class BaseAdapter implements AdapterContract {
  name: string;
  engine: string;

  constructor(name: string, engine: string) {
    this.name = name;
    this.engine = engine;
  }

  async translate(context: AdapterContext): Promise<AdapterResult> {
    throw new Error(`translate() must be implemented by ${this.engine} adapter`);
  }
}
