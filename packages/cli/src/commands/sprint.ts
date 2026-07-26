import { Command } from 'commander';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { AuditService } from '../services/audit.service.js';
import { success, error, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

export const sprintCommand = new Command('sprint')
  .description('Gère les sprints AKORIS');

sprintCommand
  .command('start')
  .description('Démarre un nouveau sprint')
  .argument('<number>', 'Numéro du sprint')
  .action((number: string) => {
    const sprintNum = parseInt(number, 10);

    if (isNaN(sprintNum) || sprintNum <= 0) {
      error('Le numéro de sprint doit être un entier positif');
      process.exit(1);
    }

    const sprintDir = join(process.cwd(), '.akoris', 'sprints', `sprint-${sprintNum}`);

    if (existsSync(sprintDir)) {
      error(`Le sprint ${sprintNum} existe déjà (${sprintDir})`);
      process.exit(1);
    }

    const dirs = [
      sprintDir,
      join(sprintDir, 'tasks'),
      join(sprintDir, 'reports'),
    ];

    for (const dir of dirs) {
      mkdirSync(dir, { recursive: true });
    }

    const sprintManifest = {
      sprint: sprintNum,
      startedAt: new Date().toISOString(),
      status: 'active',
      tasks: [],
    };

    writeFileSync(
      join(sprintDir, 'sprint.json'),
      JSON.stringify(sprintManifest, null, 2) + '\n',
    );

    if (shouldOutputJSON()) {
      printJSON(sprintManifest);
      return;
    }

    success(`Sprint ${sprintNum} démarré`);
    info(sprintDir);
  });

sprintCommand
  .command('report')
  .description('Génère un rapport pour un sprint')
  .argument('<number>', 'Numéro du sprint')
  .action(async (number: string) => {
    const sprintNum = parseInt(number, 10);

    if (isNaN(sprintNum) || sprintNum <= 0) {
      error('Le numéro de sprint doit être un entier positif');
      process.exit(1);
    }

    const sprintDir = join(process.cwd(), '.akoris', 'sprints', `sprint-${sprintNum}`);

    if (!existsSync(sprintDir)) {
      error(`Sprint ${sprintNum} introuvable`);
      process.exit(1);
    }

    try {
      info(`Génération du rapport pour le sprint ${sprintNum}...`);

      const auditService = new AuditService();
      const report = await auditService.runSprintAudit();
      const filename = auditService.saveReport(report);

      const reportDir = join(sprintDir, 'reports');
      if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });

      const reportPath = join(reportDir, `rapport-sprint-${sprintNum}.json`);
      writeFileSync(reportPath, JSON.stringify(report, null, 2));

      for (const check of report.checks) {
        log(`${check.passed ? '✅' : '❌'} ${check.name}`);
      }

      if (shouldOutputJSON()) {
        printJSON(report);
        return;
      }

      log(`\n📊 Résumé : ${report.summary.passed}/${report.summary.total} checks passés`);
      info(`Rapport sauvegardé : ${filename}`);
      info(`Rapport sprint : ${reportPath}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      error(`Erreur : ${message}`);
      process.exit(1);
    }
  });

sprintCommand
  .command('close')
  .description('Clôture un sprint avec vérifications finales')
  .argument('<number>', 'Numéro du sprint')
  .action((number: string) => {
    const sprintNum = parseInt(number, 10);

    if (isNaN(sprintNum) || sprintNum <= 0) {
      error('Le numéro de sprint doit être un entier positif');
      process.exit(1);
    }

    const sprintDir = join(process.cwd(), '.akoris', 'sprints', `sprint-${sprintNum}`);
    const sprintFile = join(sprintDir, 'sprint.json');

    if (!existsSync(sprintFile)) {
      error(`Sprint ${sprintNum} introuvable`);
      process.exit(1);
    }

    const manifest = JSON.parse(readFileSync(sprintFile, 'utf-8'));

    if (manifest.status === 'closed') {
      warn(`Le sprint ${sprintNum} est déjà clôturé`);
      return;
    }

    manifest.status = 'closed';
    manifest.closedAt = new Date().toISOString();

    writeFileSync(sprintFile, JSON.stringify(manifest, null, 2) + '\n');

    if (shouldOutputJSON()) {
      printJSON(manifest);
      return;
    }

    success(`Sprint ${sprintNum} clôturé`);
    info(sprintFile);
  });

sprintCommand
  .command('history')
  .description('Affiche l\'historique des sprints depuis .akoris/audits/')
  .action(() => {
    const auditsDir = join(process.cwd(), '.akoris', 'audits');

    if (!existsSync(auditsDir)) {
      info('Aucun historique d\'audit trouvé');
      return;
    }

    const files = readdirSync(auditsDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      info('Aucun rapport d\'audit trouvé');
      return;
    }

    if (shouldOutputJSON()) {
      const history = files.map(file => {
        try {
          const content = JSON.parse(readFileSync(join(auditsDir, file), 'utf-8'));
          return { file, ...content };
        } catch {
          return { file, error: 'impossible de lire' };
        }
      });
      printJSON(history);
      return;
    }

    log('📜 Historique des audits :');

    for (const file of files) {
      try {
        const content = JSON.parse(readFileSync(join(auditsDir, file), 'utf-8'));
        const date = content.date
          ? new Date(content.date).toLocaleDateString('fr-FR')
          : 'date inconnue';
        const status = content.status === 'passed' ? '✅' : '❌';
        const summary = content.summary
          ? `${content.summary.passed}/${content.summary.total}`
          : 'N/A';

        log(`   ${status} ${file.replace('.json', '')}`);
        log(`      Date : ${date} | Checks : ${summary}`);
      } catch {
        log(`   ⚠️  ${file} (impossible de lire)`);
      }
    }
  });
