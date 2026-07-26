export interface Environment {
  id: string; // "staging"
  name: string;
  type: 'staging' | 'production' | 'development';
  url: string;
  status: 'idle' | 'deploying' | 'deployed' | 'failed';
  lastDeployedAt?: string;
}

export interface Deployment {
  id: string; // UUID
  environment: string;
  version: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  startedAt: string;
  finishedAt?: string;
  logs: string[];
  triggeredBy: string; // Agent ID
}

export interface ConnectedService {
  id: string; // "github"
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: string;
}
