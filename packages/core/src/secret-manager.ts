import type { Secret } from './types.js';
import { NotFoundError } from './errors.js';

export class SecretManager {
  private secrets: Map<string, Secret> = new Map();

  setSecret(key: string, value: string): Secret {
    const now = new Date().toISOString();
    const existing = this.secrets.get(key);

    const secret: Secret = {
      key,
      value,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.secrets.set(key, secret);
    return secret;
  }

  getSecret(key: string): Secret {
    const secret = this.secrets.get(key);
    if (!secret) throw new NotFoundError('Secret', key);
    return secret;
  }

  removeSecret(key: string): boolean {
    return this.secrets.delete(key);
  }

  listSecrets(): string[] {
    return Array.from(this.secrets.keys());
  }
}
