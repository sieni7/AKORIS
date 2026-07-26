import { Command } from 'commander';
import { ManifestService } from '../services/manifest.service.js';
import { RegistryService } from '../services/registry.service.js';
import { shouldOutputJSON, printJSON, title, header, info, warn, log } from '../output/format.js';

export const infoCommand = new Command('info')
  .description('Show AKORIS project information')
  .action(() => {
    const manifestService = new ManifestService();
    const registry = new RegistryService();

    if (!manifestService.exists()) {
      warn('No MANIFEST.json found in current directory');
      return;
    }

    const manifest = manifestService.read();
    const summary = registry.summary();

    if (shouldOutputJSON()) {
      printJSON({ manifest, registrySummary: summary });
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

    header('Registry Summary');
    log(`  Policies:        ${summary.policies}`);
    log(`  Agents:          ${summary.agents}`);
    log(`  Contracts:       ${summary.contracts}`);
    log(`  Workflows:       ${summary.workflows}`);
    log(`  Quality Gates:   ${summary.qualityGates}`);
    log(`  Metrics:         ${summary.metrics}`);
    log(`  Checklists:      ${summary.checklists}`);
    log(`  Templates:       ${summary.templates}`);
  });
