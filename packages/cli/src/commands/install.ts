import { Command } from 'commander';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { GeneratorService } from '../services/generator.service.js';

const playbookCommand = new Command('playbook')
  .description('Installe un playbook depuis le dossier playbooks/')
  .argument('<name>', 'Nom du playbook')
  .action(async (name: string) => {
    try {
      const generator = new GeneratorService();
      const playbookPath = resolve(process.cwd(), 'playbooks', name);
      await generator.installPlaybook(playbookPath, process.cwd());
      console.log(`✅ Playbook "${name}" installé`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });

const expertCommand = new Command('expert')
  .description('Installe un agent expert (placeholder)')
  .argument('<name>', 'Nom de l\'expert')
  .action((name: string) => {
    console.log(`🔧 Installation de l'expert "${name}"...`);
    console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
  });

const connectorCommand = new Command('connector')
  .description('Installe un connecteur (github, supabase, netlify)')
  .argument('<name>', 'Nom du connecteur')
  .action((name: string) => {
    const supported = ['github', 'supabase', 'netlify'];
    const normalized = name.toLowerCase();
    if (!supported.includes(normalized)) {
      console.error(`❌ Connecteur "${name}" non supporté`);
      console.log(`   Connecteurs disponibles : ${supported.join(', ')}`);
      process.exit(1);
    }
    try {
      console.log(`🔌 Installation du connecteur "${normalized}"...`);
      console.log(`ℹ️  Contrat ${normalized} à ajouter au Registry`);
      console.log('ℹ️  Fonctionnalité à implémenter dans une version ultérieure');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });

const adapterCommand = new Command('adapter')
  .description('Installe un adaptateur (opencode, cursor, claude-code, codex)')
  .argument('<name>', 'Nom de l\'adaptateur')
  .action((name: string) => {
    const supported = ['opencode', 'cursor', 'claude-code', 'codex'];
    const normalized = name.toLowerCase();
    if (!supported.includes(normalized)) {
      console.error(`❌ Adaptateur "${name}" non supporté`);
      console.log(`   Adaptateurs disponibles : ${supported.join(', ')}`);
      process.exit(1);
    }
    try {
      const adapterDir = join(process.cwd(), '.akoris', 'adapters');
      if (!existsSync(adapterDir)) {
        mkdirSync(adapterDir, { recursive: true });
      }
      writeFileSync(join(adapterDir, `${normalized}.json`), JSON.stringify({
        adapter: normalized,
        version: '1.0.0',
        installedAt: new Date().toISOString(),
      }, null, 2));
      console.log(`✅ Adaptateur "${normalized}" installé`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ Erreur : ${message}`);
      process.exit(1);
    }
  });

export const installCommand = new Command('install')
  .description('Installe des composants AKORIS (playbook, expert, connecteur, adaptateur)')
  .addCommand(playbookCommand)
  .addCommand(expertCommand)
  .addCommand(connectorCommand)
  .addCommand(adapterCommand);
