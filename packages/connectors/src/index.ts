export interface Connector {
  name: string;
  service: string;
  connect(config: Record<string, string>): Promise<boolean>;
  disconnect(): Promise<void>;
}

export class BaseConnector implements Connector {
  name: string;
  service: string;

  constructor(name: string, service: string) {
    this.name = name;
    this.service = service;
  }

  async connect(_config: Record<string, string>): Promise<boolean> {
    throw new Error('connect() must be implemented');
  }

  async disconnect(): Promise<void> {
    throw new Error('disconnect() must be implemented');
  }
}
