#!/usr/bin/env node
/**
 * generate-agent-files.js — Génère les fichiers complémentaires des agents.
 *
 * Principes :
 *   - par défaut ne crée que les fichiers MANQUANTS (writeIfMissing)
 *   - avec --overwrite, régénère tous les fichiers dérivés
 *   - ne touche JAMAIS à agent.json (source de vérité du Registry)
 *   - ne gère NI prompt.md (propriétaire: enrich-prompts.js)
 *             NI contract.json (propriétaire: enrich-agents.js, deps/caps/raci)
 *   - extrait le contenu réel de agent.json (pas de contenu générique)
 *   - idempotent : une seconde exécution sans --overwrite ne crée rien
 *
 * Fichiers générés par agent :
 *   mission.md, contract.md, capabilities.json
 *   + dossiers tests/, examples/, assets/
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, 'registry', 'agents');

const overwrite = process.argv.includes('--overwrite');

function writeFile(filepath, content) {
  if (overwrite || !fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, content);
    return true;
  }
  return false;
}

function generateFilesForAgent(agentDir) {
  const agentJsonPath = path.join(agentDir, 'agent.json');
  if (!fs.existsSync(agentJsonPath)) {
    console.log(`⚠️  ${path.basename(agentDir)}: agent.json manquant, ignoré`);
    return;
  }

  const agent = JSON.parse(fs.readFileSync(agentJsonPath, 'utf-8'));
  const id = agent.id;
  const name = agent.name;
  const created = [];

  // mission.md
  const missionContent = `# Mission — ${name} (${id})

${agent.mission || 'Mission non définie'}

## Responsabilités
${(agent.responsibilities || []).map((r) => `- ${r}`).join('\n')}

## Limites
${(agent.limits || []).map((l) => `- ${l}`).join('\n')}
`;
  if (writeFile(path.join(agentDir, 'mission.md'), missionContent)) created.push('mission.md');

  // contract.md
  const contractContent = `# Contrat — ${name} (${id})

## Identité
- **ID** : ${id}
- **Nom** : ${name}
- **Domaine** : ${agent.domain}
- **Criticité** : ${agent.criticity}
- **Statut** : ${agent.status}

## Mission
${agent.mission || 'Mission non définie'}

## Responsabilités
${(agent.responsibilities || []).map((r) => `- ${r}`).join('\n')}

## Limites
${(agent.limits || []).map((l) => `- ${l}`).join('\n')}
`;
  if (writeFile(path.join(agentDir, 'contract.md'), contractContent)) created.push('contract.md');

  // NOTE : prompt.md est géré par scripts/enrich-prompts.js (seul écrivain).
  // NOTE : contract.json est géré par scripts/enrich-agents.js (deps/caps/raci).

  // capabilities.json
  const capabilitiesJson = JSON.stringify({
    agentId: id,
    capabilities: agent.capabilities || []
  }, null, 2);
  if (writeFile(path.join(agentDir, 'capabilities.json'), capabilitiesJson)) created.push('capabilities.json');

  // Dossiers
  ['tests', 'examples', 'assets'].forEach((dir) => {
    const dirPath = path.join(agentDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      created.push(`${dir}/`);
    }
  });

  if (created.length > 0) {
    console.log(`✅ ${id}: ${created.join(', ')}`);
  }
}

function main() {
  const dirs = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  console.log(`🚀 Génération des fichiers complémentaires pour ${dirs.length} agents...\n`);

  for (const d of dirs) {
    const agentDir = path.join(AGENTS_DIR, d);
    generateFilesForAgent(agentDir);
  }

  console.log(`\n✅ ${dirs.length} agents traités`);
}

module.exports = { generateFilesForAgent, writeFile };

if (require.main === module) {
  main();
}
