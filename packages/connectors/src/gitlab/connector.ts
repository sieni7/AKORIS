import { BaseConnector } from '../index.js';

export class GitLabConnector extends BaseConnector {
  constructor() {
    super('gitlab', 'GitLab');
  }

  async connect(config: Record<string, string>): Promise<boolean> {
    const { token, host, projectId } = config;
    if (!token || !projectId) {
      console.error('GitLab: token and projectId are required');
      return false;
    }
    return true;
  }

  async disconnect(): Promise<void> {
    console.log('GitLab connector disconnected');
  }
}
