import { describe, it, expect } from 'vitest';
import { SecretManager } from '../src/secret-manager.js';

describe('SecretManager', () => {
  it('should set and get a secret', () => {
    const sm = new SecretManager();
    sm.setSecret('API_KEY', 'abc123');
    const secret = sm.getSecret('API_KEY');
    expect(secret.key).toBe('API_KEY');
    expect(secret.value).toBe('abc123');
  });

  it('should throw on unknown secret', () => {
    const sm = new SecretManager();
    expect(() => sm.getSecret('unknown')).toThrow('not found');
  });

  it('should remove a secret', () => {
    const sm = new SecretManager();
    sm.setSecret('TOKEN', 'xyz');
    expect(sm.removeSecret('TOKEN')).toBe(true);
    expect(() => sm.getSecret('TOKEN')).toThrow('not found');
  });

  it('should list secret keys', () => {
    const sm = new SecretManager();
    sm.setSecret('A', '1');
    sm.setSecret('B', '2');
    expect(sm.listSecrets()).toEqual(['A', 'B']);
  });
});
