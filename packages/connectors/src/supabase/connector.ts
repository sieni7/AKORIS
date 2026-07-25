import { BaseConnector } from '../index.js';

export class SupabaseConnector extends BaseConnector {
  constructor() {
    super('supabase', 'Supabase');
  }

  async connect(config: Record<string, string>): Promise<boolean> {
    const { url, anonKey } = config;
    if (!url || !anonKey) {
      console.error('Supabase: url and anonKey are required');
      return false;
    }
    return true;
  }

  async disconnect(): Promise<void> {
    console.log('Supabase connector disconnected');
  }
}
