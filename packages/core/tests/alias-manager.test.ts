import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AliasManager } from '../src/alias/alias-manager.js';
import { createTempDir, cleanupDir } from './helpers.js';

describe('AliasManager', () => {
  let dir: string;
  let manager: AliasManager;

  beforeEach(async () => {
    dir = await createTempDir();
    manager = new AliasManager(dir);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  describe('listAliases', () => {
    it('retourne un objet vide par défaut', async () => {
      const aliases = await manager.listAliases();
      expect(aliases).toEqual({});
    });
  });

  describe('setAlias / resolveAlias', () => {
    it('crée et résout un alias', async () => {
      await manager.setAlias('st', 'state show');
      const resolved = await manager.resolveAlias('st');
      expect(resolved).toBe('state show');
    });

    it('résout null pour un alias inconnu', async () => {
      const resolved = await manager.resolveAlias('unknown');
      expect(resolved).toBeNull();
    });

    it('remplace un alias existant', async () => {
      await manager.setAlias('st', 'state show');
      await manager.setAlias('st', 'state info');
      const resolved = await manager.resolveAlias('st');
      expect(resolved).toBe('state info');
    });
  });

  describe('removeAlias', () => {
    it('supprime un alias existant', async () => {
      await manager.setAlias('test', 'doctor');
      const removed = await manager.removeAlias('test');
      expect(removed).toBe(true);
      const resolved = await manager.resolveAlias('test');
      expect(resolved).toBeNull();
    });

    it('retourne false pour un alias inexistant', async () => {
      const removed = await manager.removeAlias('nonexistent');
      expect(removed).toBe(false);
    });
  });
});
