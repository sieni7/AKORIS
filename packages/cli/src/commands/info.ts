import { Command } from 'commander';
import { RegistryReader } from '@akoris/core';
import { ManifestService } from '../services/manifest.service.js';
import { getProjectRoot } from '../services/project.service.js';
import { shouldOutputJSON, printJSON, title, header, info, warn, log } from '../output/format.js';

export const infoCommand = new Command('info')
  .description('Show AKORIS project information')
  .action(async () => {
    const projectRoot = getProjectRoot();
    const manifestService = new ManifestService(projectRoot);

    if (!manifestService.exists()) {
      warn('No MANIFEST.json found in current directory');
      return;
    }

    const manifest = manifestService.read();
    const reader = new RegistryReader(projectRoot);
    let index;
    try {
      index = await reader.loadIndex();
    } catch {
      index = null;
    }

    if (shouldOutputJSON()) {
      printJSON({ manifest, registry: index });
      return;
    }

    title('AKORIS Project Info');
    log(`  Name:            ${manifest.name}`);
    log(`  Version:         ${manifest.version}`);
    log(`  Method Version:  ${manifest.akoris}`);
    log(`  Registry:        v${manifest.registry.version}`);
    log(`  Playbook:        ${manifest.playbook || '(not set)'}`);
    log(`  Project Type:    ${manifest.projectType || '(not set)'}`);

    if (manifest.components) {
      const comps = manifest.components as Record<string, boolean>;
      header('Components');
      for (const [key, enabled] of Object.entries(comps)) {
        log(`  ${key}: ${enabled ? 'enabled' : 'disabled'}`);
      }
    }

    if (index) {
      header('Registry Summary');
      if (index.components) {
        for (const [name, comp] of Object.entries(index.components)) {
          log(`  ${name.padEnd(15)} ${(comp as any).count}`);
        }
      }
    }
  });
