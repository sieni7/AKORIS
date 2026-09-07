#!/usr/bin/env node
/**
 * enrich-prompts.js — Génère le prompt.md enrichi de chaque agent.
 *
 * Principes :
 *   - SEUL écrivain de prompt.md (écrase systématiquement)
 *   - extrait le contenu réel de agent.json
 *   - consignes par domaine (CORE/DEV/QA/EXP/GOV)
 *   - expose les variables {{agent}}, {{domain}}, {{criticity}}
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, 'registry', 'agents');

const DOMAIN_CONSIGNES = {
  CORE: [
    '- Garantir la coordination entre tous les agents',
    "- Valider les transitions d'état",
    '- Arbitrer les conflits entre les livrables'
  ],
  DEV: [
    '- Produire du code conforme aux standards',
    '- Respecter les contrats API',
    '- Appliquer les bonnes pratiques de développement'
  ],
  QA: [
    '- Assurer la qualité du code et des processus',
    '- Auditer la sécurité et les performances',
    '- Émettre des recommandations actionnables'
  ],
  EXP: [
    '- Apporter une expertise spécifique',
    '- Optimiser les processus du domaine',
    '- Formuler des recommandations étayées'
  ],
  GOV: [
    "- Garantir le respect de la méthode AKORIS",
    '- Valider les Quality Gates',
    '- Faire évoluer le standard méthodologique'
  ]
};

function generatePrompt(agent) {
  const consignes = DOMAIN_CONSIGNES[agent.domain] || [];
  const criticite = agent.criticity === 'critique' ? '⚠️ critique' : agent.criticity;

  return `# Prompt de référence — ${agent.name} (${agent.id})

Tu es ${agent.name} (${agent.id}) — domaine ${agent.domain}, criticité ${criticite}.

## Mission
${agent.mission || 'Mission non définie'}

## Consignes par domaine

### ${agent.domain}
${consignes.map((c) => c).join('\n')}

## Responsabilités
${(agent.responsibilities || []).map((r) => `- ${r}`).join('\n')}

## Limites
${(agent.limits || []).map((l) => `- ${l}`).join('\n')}

## Format de sortie
Markdown structuré avec les sections Résumé, Détails, Preuves.

## Variables disponibles
- \`{{agent}}\` : ${agent.id}
- \`{{domain}}\` : ${agent.domain}
- \`{{criticity}}\` : ${agent.criticity}
`;
}

function main() {
  const dirs = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  console.log('📝 Génération des prompts enrichis...\n');

  let done = 0;

  for (const id of dirs) {
    const agentPath = path.join(AGENTS_DIR, id, 'agent.json');
    if (!fs.existsSync(agentPath)) {
      console.log(`⏭️  ${id}: agent.json manquant, ignoré`);
      continue;
    }
    const agent = JSON.parse(fs.readFileSync(agentPath, 'utf-8'));
    const promptPath = path.join(AGENTS_DIR, id, 'prompt.md');
    fs.writeFileSync(promptPath, generatePrompt(agent));
    done++;
  }

  console.log(`✅ prompt.md enrichi pour ${done} agents`);
}

module.exports = { generatePrompt };

if (require.main === module) {
  main();
}
