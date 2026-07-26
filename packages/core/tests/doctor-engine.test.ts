import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DoctorEngine } from '../src/doctor/doctor-engine.js';
import { createTempDir, cleanupDir } from './helpers.js';
import { access, constants } from 'fs/promises';
import { join } from 'path';

describe('DoctorEngine', () => {
  let dir: string;
  let doctor: DoctorEngine;

  beforeEach(async () => {
    dir = await createTempDir();
    doctor = new DoctorEngine(dir);
  });

  afterEach(async () => {
    await cleanupDir(dir);
  });

  describe('diagnose', () => {
    it('signale les problèmes si .akoris est manquant', async () => {
      const result = await doctor.diagnose();
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues.some(i => i.includes('.akoris'))).toBe(true);
    });

    it('ne signale aucun problème si le projet est sain', async () => {
      const { mkdir, writeFile } = await import('fs/promises');
      await mkdir(join(dir, '.akoris'), { recursive: true });
      await writeFile(join(dir, '.akoris', 'manifest.json'), JSON.stringify({}));
      await writeFile(join(dir, '.akoris', 'state.json'), JSON.stringify({}));
      const result = await doctor.diagnose();
      expect(result.issues).toEqual([]);
    });
  });

  describe('fix', () => {
    it('crée le dossier .akoris/', async () => {
      await doctor.fix();
      await expect(access(join(dir, '.akoris'), constants.F_OK)).resolves.not.toThrow();
    });

    it('crée les sous-dossiers', async () => {
      await doctor.fix();
      const subs = ['logs', 'logs/sessions', 'adr', 'sprints', 'audits', 'knowledge', 'metrics'];
      for (const sub of subs) {
        await expect(access(join(dir, '.akoris', sub), constants.F_OK)).resolves.not.toThrow();
      }
    });

    it('crée manifest.json par défaut', async () => {
      await doctor.fix();
      const { readFile } = await import('fs/promises');
      const manifest = JSON.parse(await readFile(join(dir, '.akoris', 'manifest.json'), 'utf-8'));
      expect(manifest.projectName).toBeTruthy();
      expect(manifest.akorisVersion).toBe('^1.0.0');
    });

    it('crée state.json par défaut', async () => {
      await doctor.fix();
      const { readFile } = await import('fs/promises');
      const state = JSON.parse(await readFile(join(dir, '.akoris', 'state.json'), 'utf-8'));
      expect(state.currentState).toBe('DRAFT');
    });

    it('retourne la liste des corrections', async () => {
      const result = await doctor.fix();
      expect(result.fixes.length).toBeGreaterThan(0);
    });
  });
});
