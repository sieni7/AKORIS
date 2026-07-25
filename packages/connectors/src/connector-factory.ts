import { GitHubConnector } from './github/connector.js';
import { GitLabConnector } from './gitlab/connector.js';
import { SupabaseConnector } from './supabase/connector.js';
import { NetlifyConnector } from './netlify/connector.js';
import type { Connector } from './index.js';

const connectors: Record<string, new () => Connector> = {
  github: GitHubConnector,
  gitlab: GitLabConnector,
  supabase: SupabaseConnector,
  netlify: NetlifyConnector,
};

export function getConnector(service: string): Connector | null {
  const ConnectorClass = connectors[service.toLowerCase()];
  if (!ConnectorClass) return null;
  return new ConnectorClass();
}

export function listConnectors(): string[] {
  return Object.keys(connectors);
}
