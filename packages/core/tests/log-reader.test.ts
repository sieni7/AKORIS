import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LogReader } from '../src/logs/log-reader.js';
import { createTempDir, cleanupDir, createFixture } from './helpers.js';

describe('LogReader', () => {
  let dir: string;
  let reader: LogReader;

  beforeEach(async () => {
    dir = await createTempDir();
    reader = new LogReader(dir);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  describe('readLogs', () => {
    it('retourne un tableau vide si aucun dossier logs', async () => {
      const entries = await reader.readLogs();
      expect(entries).toEqual([]);
    });

    it('lit les logs depuis les fichiers JSON', async () => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        agentId: 'CORE-01',
        action: 'transition',
        details: 'DRAFT → REVIEW',
      };
      await createFixture(dir, '.akoris/logs/sessions/session-001.json', [logEntry]);
      const entries = await reader.readLogs();
      expect(entries).toHaveLength(1);
      expect(entries[0].agentId).toBe('CORE-01');
    });

    it('filtre par agent', async () => {
      await createFixture(dir, '.akoris/logs/sessions/session-001.json', [
        { timestamp: '2026-01-01T00:00:00Z', agentId: 'CORE-01', action: 'start', details: 'Début' },
        { timestamp: '2026-01-01T00:01:00Z', agentId: 'DEV-01', action: 'code', details: 'Commit' },
      ]);
      const entries = await reader.readLogs({ agent: 'CORE-01' });
      expect(entries).toHaveLength(1);
      expect(entries[0].agentId).toBe('CORE-01');
    });

    it('limite le nombre de lignes', async () => {
      const logs = Array.from({ length: 10 }, (_, i) => ({
        timestamp: `2026-01-01T00:0${i}:00Z`,
        agentId: 'CORE-01',
        action: 'step',
        details: `Étape ${i}`,
      }));
      await createFixture(dir, '.akoris/logs/sessions/session-001.json', logs);
      const entries = await reader.readLogs({ lines: 3 });
      expect(entries).toHaveLength(3);
    });

    it('filtre par date (since)', async () => {
      await createFixture(dir, '.akoris/logs/sessions/session-001.json', [
        { timestamp: '2026-01-01T00:00:00Z', agentId: 'CORE-01', action: 'old', details: 'Ancien' },
        { timestamp: '2026-06-01T00:00:00Z', agentId: 'CORE-01', action: 'new', details: 'Récent' },
      ]);
      const entries = await reader.readLogs({ since: '2026-03-01' });
      expect(entries).toHaveLength(1);
      expect(entries[0].action).toBe('new');
    });

    it('gère les formats de log alternatifs', async () => {
      await createFixture(dir, '.akoris/logs/sessions/session-001.json', {
        entries: [
          { time: '2026-01-01T00:00:00Z', agent: 'CORE-01', type: 'test', message: 'Log avec champs alternatifs' },
        ],
      });
      const entries = await reader.readLogs();
      expect(entries).toHaveLength(1);
      expect(entries[0].agentId).toBe('CORE-01');
    });
  });
});
