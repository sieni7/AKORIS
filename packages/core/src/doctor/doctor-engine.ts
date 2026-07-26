import { mkdir, writeFile, access, constants } from 'fs/promises';
import { join } from 'path';

export class DoctorEngine {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async diagnose(): Promise<{ issues: string[]; warnings: string[] }> {
    const issues: string[] = [];
    const warnings: string[] = [];

    const akorisPath = join(this.projectRoot, '.akoris');
    try {
      await access(akorisPath, constants.F_OK);
    } catch (_) {
      issues.push('Dossier .akoris/ manquant');
    }

    const manifestPath = join(akorisPath, 'manifest.json');
    try {
      await access(manifestPath, constants.F_OK);
    } catch (_) {
      issues.push('Fichier manifest.json manquant');
    }

    const statePath = join(akorisPath, 'state.json');
    try {
      await access(statePath, constants.F_OK);
    } catch (_) {
      issues.push('Fichier state.json manquant');
    }

    return { issues, warnings };
  }

  async fix(): Promise<{ fixes: string[] }> {
    const fixes: string[] = [];
    const akorisPath = join(this.projectRoot, '.akoris');

    try {
      await access(akorisPath, constants.F_OK);
    } catch (_) {
      await mkdir(akorisPath, { recursive: true });
      fixes.push('Dossier .akoris/ créé');
    }

    const subdirs = ['logs', 'logs/sessions', 'adr', 'sprints', 'audits', 'knowledge', 'metrics'];
    for (const subdir of subdirs) {
      const path = join(akorisPath, subdir);
      try {
        await access(path, constants.F_OK);
      } catch (_) {
        await mkdir(path, { recursive: true });
        fixes.push(`Sous-dossier ${subdir} créé`);
      }
    }

    const manifestPath = join(akorisPath, 'manifest.json');
    try {
      await access(manifestPath, constants.F_OK);
    } catch (_) {
      const defaultManifest = {
        projectName: 'mon-projet-akoris',
        projectId: crypto.randomUUID(),
        akorisVersion: '^1.0.0',
        registryPath: '../../registry/',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        agents: ['CORE-01', 'DEV-01', 'QA-01'],
        defaultLanguage: 'fr',
        domain: 'web-app',
      };
      await writeFile(manifestPath, JSON.stringify(defaultManifest, null, 2), 'utf-8');
      fixes.push('manifest.json créé avec les valeurs par défaut');
    }

    const statePath = join(akorisPath, 'state.json');
    try {
      await access(statePath, constants.F_OK);
    } catch (_) {
      const defaultState = {
        currentState: 'DRAFT',
        history: [],
        lastTransition: null,
      };
      await writeFile(statePath, JSON.stringify(defaultState, null, 2), 'utf-8');
      fixes.push('state.json créé avec l\'état DRAFT');
    }

    return { fixes };
  }
}
