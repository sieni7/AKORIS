import { Command } from 'commander';
import { DoctorEngine } from '@akoris/core';
import { getProjectRoot } from '../services/project.service.js';
import { success, warn, info, log, shouldOutputJSON, printJSON } from '../output/format.js';

export const syncCommand = new Command('sync')
  .description('Diagnostique et répare l\'état du projet AKORIS')
  .option('--fix', 'Tente de corriger automatiquement les problèmes')
  .action(async (options?: { fix?: boolean }) => {
    const projectRoot = getProjectRoot();
    const doctor = new DoctorEngine(projectRoot);

    const diagnosis = await doctor.diagnose();

    if (options?.fix) {
      const result = await doctor.fix();
      if (shouldOutputJSON()) {
        printJSON({ diagnosis, fixes: result.fixes });
        return;
      }
      if (result.fixes.length > 0) {
        success(`${result.fixes.length} correction(s) appliquée(s) :`);
        for (const fix of result.fixes) {
          log(`  - ${fix}`);
        }
      }
    }

    if (shouldOutputJSON()) {
      printJSON({ diagnosis, fixApplied: !!options?.fix });
      return;
    }

    if (diagnosis.issues.length === 0) {
      success('Aucun problème détecté. Le projet est sain.');
    } else {
      warn(`${diagnosis.issues.length} problème(s) détecté(s) :`);
      for (const issue of diagnosis.issues) {
        log(`  - ${issue}`);
      }
      if (!options?.fix) {
        info('\n💡 Pour corriger automatiquement :  akoris doctor --fix');
      }
    }
  });
