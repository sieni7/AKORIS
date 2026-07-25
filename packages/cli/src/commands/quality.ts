import { Command } from 'commander';
import { QualityService } from '../services/quality.service.js';

export const qualityCommand = new Command('quality')
  .description('Vérifie la qualité du projet via les Quality Gates')
  .argument('[action]', 'Action (check, gates, list)')
  .action(async (action?: string) => {
    const qualityService = new QualityService();

    try {
      if (action === 'list' || action === 'gates') {
        const gates = qualityService.getGateDefinitions();
        if (!gates) {
          console.log('Aucun Quality Gate défini dans le Registry');
          return;
        }
        console.log('📋 Quality Gates disponibles :\n');
        for (const gate of gates.gates) {
          console.log(`  ${gate.critical ? '🔴' : '🟡'} ${gate.name}`);
          console.log(`     ${gate.description}`);
          console.log(`     Type: ${gate.type} | Critique: ${gate.critical}`);
          console.log();
        }
      } else {
        console.log('🔍 Vérification des Quality Gates...\n');
        const result = await qualityService.runAllChecks();

        for (const gate of result.gates) {
          console.log(`${gate.passed ? '✅' : '❌'} ${gate.name}`);
          if (gate.details) console.log(`   ${gate.details}`);
        }

        console.log(`\n📊 ${result.summary.passed}/${result.summary.total} gates passés`);
        console.log(`\n${result.overall === 'passed' ? '✅' : '⚠️'} Qualité globale : ${result.overall}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });
