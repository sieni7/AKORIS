import { Command } from 'commander';
import { ManifestService } from '../services/manifest.service.js';
import { RegistryService } from '../services/registry.service.js';

export const infoCommand = new Command('info')
  .description('Show AKORIS project information')
  .action(() => {
    const manifestService = new ManifestService();
    const registry = new RegistryService();

    if (!manifestService.exists()) {
      console.log('No MANIFEST.json found in current directory');
      return;
    }

    const manifest = manifestService.read();
    const summary = registry.summary();

    const componentList = [];
    if (manifest.components) {
      const comps = manifest.components as Record<string, boolean>;
      for (const [key, enabled] of Object.entries(comps)) {
        componentList.push(`  ${key}: ${enabled ? 'enabled' : 'disabled'}`);
      }
    }

    console.log('AKORIS Project Info\n');
    console.log(`  Name:            ${manifest.name}`);
    console.log(`  Version:         ${manifest.version}`);
    console.log(`  Method Version:  ${manifest.akoris}`);
    console.log(`  Registry:        v${manifest.registry.version}`);
    console.log(`  Playbook:        ${manifest.playbook || '(not set)'}`);
    console.log(`  Project Type:    ${manifest.projectType || '(not set)'}`);
    console.log(`\n  Components:\n${componentList.join('\n')}`);
    console.log(`\n  Registry Summary:`);
    console.log(`  Policies:        ${summary.policies}`);
    console.log(`  Agents:          ${summary.agents}`);
    console.log(`  Contracts:       ${summary.contracts}`);
    console.log(`  Workflows:       ${summary.workflows}`);
    console.log(`  Quality Gates:   ${summary.qualityGates}`);
    console.log(`  Metrics:         ${summary.metrics}`);
    console.log(`  Checklists:      ${summary.checklists}`);
    console.log(`  Templates:       ${summary.templates}`);
  });
