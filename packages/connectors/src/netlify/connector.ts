import { BaseConnector } from '../index.js';

export class NetlifyConnector extends BaseConnector {
  constructor() {
    super('netlify', 'Netlify');
  }

  async connect(config: Record<string, string>): Promise<boolean> {
    const token = config.token;
    if (!token) {
      console.error('Netlify: token is required');
      return false;
    }
    return true;
  }

  async disconnect(): Promise<void> {
    console.log('Netlify connector disconnected');
  }
}
