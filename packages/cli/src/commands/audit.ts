import { Command } from 'commander';
import { AuditService } from '../services/audit.service.js';

export const auditCommand = new Command('audit')
  .description('Lance un audit AKORIS')
  .argument('[scope]', 'Périmètre de l\'audit (sprint, project, security)')
  .action(async (scope?: string) => {
    const auditService = new AuditService();

    try {
      console.log(`📋 Audit ${scope || 'global'} en cours...\n`);

      const report = await auditService.runSprintAudit();
      const filename = auditService.saveReport(report);

      for (const check of report.checks) {
        console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
      }

      console.log(`\n📊 Résumé : ${report.summary.passed}/${report.summary.total} checks passés`);
      console.log(`📁 Rapport sauvegardé : .akoris/audits/${filename}`);

      if (report.status === 'passed') {
        console.log('\n✅ Audit terminé avec succès');
      } else {
        console.log('\n⚠️ Des problèmes ont été détectés');
        process.exitCode = 1;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });
