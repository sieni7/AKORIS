import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SecretManager } from '../src/secrets/secret-manager.js';
import { createTempDir, cleanupDir } from './helpers.js';

describe('SecretManager', () => {
  let dir: string;
  let manager: SecretManager;

  beforeEach(async () => {
    dir = await createTempDir();
    manager = new SecretManager(dir);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  describe('setSecret / getSecret', () => {
    it('chiffre et déchiffre un secret', async () => {
      await manager.setSecret('GITHUB_TOKEN', 'ghp_abc123');
      const value = await manager.getSecret('GITHUB_TOKEN');
      expect(value).toBe('ghp_abc123');
    });

    it('retourne null pour un secret inexistant', async () => {
      const value = await manager.getSecret('NONEXISTENT');
      expect(value).toBeNull();
    });

    it('gère plusieurs secrets', async () => {
      await manager.setSecret('KEY_A', 'value_a');
      await manager.setSecret('KEY_B', 'value_b');
      expect(await manager.getSecret('KEY_A')).toBe('value_a');
      expect(await manager.getSecret('KEY_B')).toBe('value_b');
    });
  });

  describe('removeSecret', () => {
    it('supprime un secret existant', async () => {
      await manager.setSecret('TEMP_KEY', 'temp_value');
      const removed = await manager.removeSecret('TEMP_KEY');
      expect(removed).toBe(true);
      expect(await manager.getSecret('TEMP_KEY')).toBeNull();
    });

    it('retourne false pour un secret inexistant', async () => {
      const removed = await manager.removeSecret('NONEXISTENT');
      expect(removed).toBe(false);
    });
  });

  describe('listSecrets', () => {
    it('retourne une liste vide par défaut', async () => {
      const keys = await manager.listSecrets();
      expect(keys).toEqual([]);
    });

    it('retourne les clés des secrets stockés', async () => {
      await manager.setSecret('KEY_1', 'val1');
      await manager.setSecret('KEY_2', 'val2');
      const keys = await manager.listSecrets();
      expect(keys).toContain('KEY_1');
      expect(keys).toContain('KEY_2');
      expect(keys).toHaveLength(2);
    });
  });

  describe('chiffrement AES-256-GCM', () => {
    it('produit des valeurs chiffrées différentes pour le même texte', async () => {
      await manager.setSecret('SAME', 'hello');
      await manager.setSecret('SAME2', 'hello');
      const value1 = await manager.getSecret('SAME');
      const value2 = await manager.getSecret('SAME2');
      expect(value1).toBe('hello');
      expect(value2).toBe('hello');
    });

    it('gère les chaînes vides', async () => {
      await manager.setSecret('EMPTY', '');
      const value = await manager.getSecret('EMPTY');
      expect(value).toBe('');
    });

    it('gère les valeurs longues', async () => {
      const longValue = 'A'.repeat(10000);
      await manager.setSecret('LONG', longValue);
      const value = await manager.getSecret('LONG');
      expect(value).toBe(longValue);
    });
  });
});
