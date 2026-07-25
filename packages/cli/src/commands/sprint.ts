import { Command } from 'commander';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { AuditService } from '../services/audit.service.js';

export const sprintCommand = new Command('sprint')
  .description('Gère les sprints AKORIS');

sprintCommand
  .command('start')
  .description('Démarre un nouveau sprint')
  .argument('<number>', 'Numéro du sprint')
  .action((number: string) => {
    const sprintNum = parseInt(number, 10);

    if (isNaN(sprintNum) || sprintNum <= 0) {
      console.error('❌ Le numéro de sprint doit être un entier positif');
      process.exit(1);
    }

    const sprintDir = join(process.cwd(), '.akoris', 'sprints', `sprint-${sprintNum}`);

    if (existsSync(sprintDir)) {
      console.error(`❌ Le sprint ${sprintNum} existe déjà (${sprintDir})`);
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

    console.log(`🚀 Sprint ${sprintNum} démarré`);
    console.log(`📁 ${sprintDir}`);
  });

sprintCommand
  .command('report')
  .description('Génère un rapport pour un sprint')
  .argument('<number>', 'Numéro du sprint')
  .action(async (number: string) => {
    const sprintNum = parseInt(number, 10);

    if (isNaN(sprintNum) || sprintNum <= 0) {
      console.error('❌ Le numéro de sprint doit être un entier positif');
      process.exit(1);
    }

    const sprintDir = join(process.cwd(), '.akoris', 'sprints', `sprint-${sprintNum}`);

    if (!existsSync(sprintDir)) {
      console.error(`❌ Sprint ${sprintNum} introuvable`);
      process.exit(1);
    }

    try {
      console.log(`📊 Génération du rapport pour le sprint ${sprintNum}...\n`);

      const auditService = new AuditService();
      const report = await auditService.runSprintAudit();
      const filename = auditService.saveReport(report);

      const reportDir = join(sprintDir, 'reports');
      if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });

      const reportPath = join(reportDir, `rapport-sprint-${sprintNum}.json`);
      writeFileSync(reportPath, JSON.stringify(report, null, 2));

      for (const check of report.checks) {
        console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
      }

      console.log(`\n📊 Résumé : ${report.summary.passed}/${report.summary.total} checks passés`);
      console.log(`📁 Rapport sauvegardé : ${filename}`);
      console.log(`📁 Rapport sprint : ${reportPath}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
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
      console.error('❌ Le numéro de sprint doit être un entier positif');
      process.exit(1);
    }

    const sprintDir = join(process.cwd(), '.akoris', 'sprints', `sprint-${sprintNum}`);
    const sprintFile = join(sprintDir, 'sprint.json');

    if (!existsSync(sprintFile)) {
      console.error(`❌ Sprint ${sprintNum} introuvable`);
      process.exit(1);
    }

    const manifest = JSON.parse(readFileSync(sprintFile, 'utf-8'));

    if (manifest.status === 'closed') {
      console.log(`⚠️  Le sprint ${sprintNum} est déjà clôturé`);
      return;
    }

    manifest.status = 'closed';
    manifest.closedAt = new Date().toISOString();

    writeFileSync(sprintFile, JSON.stringify(manifest, null, 2) + '\n');

    console.log(`✅ Sprint ${sprintNum} clôturé`);
    console.log(`📁 ${sprintFile}`);
  });

sprintCommand
  .command('history')
  .description('Affiche l\'historique des sprints depuis .akoris/audits/')
  .action(() => {
    const auditsDir = join(process.cwd(), '.akoris', 'audits');

    if (!existsSync(auditsDir)) {
      console.log('ℹ️  Aucun historique d\'audit trouvé');
      return;
    }

    const files = readdirSync(auditsDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.log('ℹ️  Aucun rapport d\'audit trouvé');
      return;
    }

    console.log('📜 Historique des audits :\n');

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

        console.log(`   ${status} ${file.replace('.json', '')}`);
        console.log(`      Date : ${date} | Checks : ${summary}`);
      } catch {
        console.log(`   ⚠️  ${file} (impossible de lire)`);
      }
    }
  });
