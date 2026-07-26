import { mkdir, readFile, writeFile, access, constants } from 'fs/promises';
import { dirname, join } from 'path';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class SecretManager {
  private projectRoot: string;
  private key: Buffer | null = null;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  private async ensureDir(): Promise<void> {
    await mkdir(dirname(this.getSecretsPath()), { recursive: true });
  }

  private async getKey(): Promise<Buffer> {
    if (this.key) return this.key;
    const keyPath = join(this.projectRoot, '.akoris', '.secret.key');
    try {
      await access(keyPath, constants.F_OK);
      const content = await readFile(keyPath);
      this.key = content;
    } catch (_) {
      await mkdir(dirname(keyPath), { recursive: true });
      this.key = randomBytes(32);
      await writeFile(keyPath, this.key);
    }
    return this.key;
  }

  private getSecretsPath(): string {
    return join(this.projectRoot, '.akoris', 'secrets.enc');
  }

  private async loadSecrets(): Promise<Record<string, string>> {
    const path = this.getSecretsPath();
    try {
      const content = await readFile(path, 'utf-8');
      const data = JSON.parse(content);
      return data;
    } catch (_) {
      return {};
    }
  }

  private async saveSecrets(secrets: Record<string, string>): Promise<void> {
    await this.ensureDir();
    await writeFile(this.getSecretsPath(), JSON.stringify(secrets, null, 2), 'utf-8');
  }

  async setSecret(key: string, value: string): Promise<void> {
    const secrets = await this.loadSecrets();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', await this.getKey(), iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    secrets[key] = JSON.stringify({ iv: iv.toString('hex'), authTag, encrypted });
    await this.saveSecrets(secrets);
  }

  async getSecret(key: string): Promise<string | null> {
    const secrets = await this.loadSecrets();
    const entry = secrets[key];
    if (!entry) return null;
    try {
      const { iv, authTag, encrypted } = JSON.parse(entry);
      const decipher = createDecipheriv('aes-256-gcm', await this.getKey(), Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (_) {
      return null;
    }
  }

  async removeSecret(key: string): Promise<boolean> {
    const secrets = await this.loadSecrets();
    if (!secrets[key]) return false;
    delete secrets[key];
    await this.saveSecrets(secrets);
    return true;
  }

  async listSecrets(): Promise<string[]> {
    const secrets = await this.loadSecrets();
    return Object.keys(secrets);
  }
}
