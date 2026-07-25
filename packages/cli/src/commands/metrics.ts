import { Command } from 'commander';
import { RegistryService } from '../services/registry.service.js';

export const metricsCommand = new Command('metrics')
  .description('Affiche les métriques du projet')
  .action(() => {
    const registry = new RegistryService();
    const metricsDef = registry.getMetrics();

    if (!metricsDef) {
      console.log('Aucune métrique définie dans le Registry');
      return;
    }

    console.log('📊 Métriques AKORIS\n');
    for (const metric of metricsDef.metrics) {
      console.log(`  📈 ${metric.name}`);
      console.log(`     Type: ${metric.type}`);
      console.log(`     ${metric.description}\n`);
    }
  });
