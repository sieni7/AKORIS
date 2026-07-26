import { Command } from 'commander';
import { writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { RegistryReader } from '@akoris/core';
import { getProjectRoot } from '../services/project.service.js';
import { success, error, info, shouldOutputJSON, printJSON } from '../output/format.js';

const registrySubCommand = new Command('registry')
  .description('Exporte le Registry au format JSON')
  .option('-o, --output <path>', 'Chemin de sortie')
  .action(async (options?: { output?: string }) => {
    try {
      const projectRoot = getProjectRoot();
      const reader = new RegistryReader(projectRoot);
      const index = await reader.loadIndex();
      const agents = await reader.listAgents();

      const data = { index, agents };
      const outputPath = options?.output || join(process.cwd(), 'registry-export.json');
      writeFileSync(outputPath, JSON.stringify(data, null, 2));
      if (shouldOutputJSON()) {
        printJSON({ exported: true, path: outputPath });
        return;
      }
      success(`Registry exporté vers ${outputPath}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

const auditSubCommand = new Command('audit')
  .description('Exporte le dernier rapport d\'audit')
  .option('-o, --output <path>', 'Chemin de sortie')
  .action(async (options?: { output?: string }) => {
    try {
      const auditDir = join(process.cwd(), '.akoris', 'audits');
      if (!existsSync(auditDir)) {
        error('Aucun dossier .akoris/audits/ trouvé');
        process.exit(1);
      }
      const files = readdirSync(auditDir).filter(f => f.endsWith('.json'));
      if (files.length === 0) {
        error('Aucun rapport d\'audit trouvé');
        process.exit(1);
      }
      const latest = files.sort().reverse()[0];
      const { readFileSync } = await import('node:fs');
      const report = JSON.parse(readFileSync(join(auditDir, latest), 'utf-8'));
      const outputPath = options?.output || join(process.cwd(), 'audit-export.json');
      writeFileSync(outputPath, JSON.stringify(report, null, 2));
      if (shouldOutputJSON()) {
        printJSON({ exported: true, path: outputPath, source: latest });
        return;
      }
      success(`Dernier audit exporté vers ${outputPath} (${latest})`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

const projectSubCommand = new Command('project')
  .description('Exporte le résumé complet du projet au format JSON')
  .option('-o, --output <path>', 'Chemin de sortie')
  .action(async (options?: { output?: string }) => {
    try {
      const { ManifestService } = await import('../services/manifest.service.js');
      const manifestService = new ManifestService();
      const projectRoot = getProjectRoot();
      const reader = new RegistryReader(projectRoot);
      const index = await reader.loadIndex();
      const hasManifest = manifestService.exists();
      const summary: Record<string, unknown> = {
        exportedAt: new Date().toISOString(),
        manifest: hasManifest ? manifestService.read() : null,
        registry: index,
      };
      const adrDir = join(process.cwd(), '.akoris', 'decisions');
      if (existsSync(adrDir)) {
        summary.adrs = readdirSync(adrDir);
      }
      const outputPath = options?.output || join(process.cwd(), 'project-export.json');
      writeFileSync(outputPath, JSON.stringify(summary, null, 2));
      if (shouldOutputJSON()) {
        printJSON({ exported: true, path: outputPath });
        return;
      }
      success(`Projet exporté vers ${outputPath}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

export const exportCommand = new Command('export')
  .description('Exporte les données du projet AKORIS')
  .addCommand(registrySubCommand)
  .addCommand(auditSubCommand)
  .addCommand(projectSubCommand);
