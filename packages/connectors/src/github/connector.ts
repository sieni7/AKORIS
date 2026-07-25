import { BaseConnector } from '../index.js';

export class GitHubConnector extends BaseConnector {
  constructor() {
    super('github', 'GitHub');
  }

  async connect(config: Record<string, string>): Promise<boolean> {
    const { token, owner, repo } = config;
    if (!token || !owner || !repo) {
      console.error('GitHub: token, owner, and repo are required');
      return false;
    }
    return true;
  }

  async disconnect(): Promise<void> {
    console.log('GitHub connector disconnected');
  }
}
