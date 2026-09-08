import type { Agent, AgentDependency, Capability } from '../../src/types.js';

/**
 * Fixtures de TEST — 40 agents mockés conformes à l'interface `Agent` (§4.1).
 *
 * INVARIANT AKORIS : fixtures ≠ Registry ≠ source de vérité.
 * Ces données sont strictement des données de test (réplicats réalistes du
 * Registry `registry/agents/`), utilisées uniquement par les tests.
 * `RegistryReader` reçoit la collection via son constructeur ; la production
 * injecte le Registry réel, jamais ces fixtures.
 */

const MISSION_BY_DOMAIN: Record<string, string> = {
  CORE: 'Orchestration du noyau de gouvernance',
  DEV: 'Production de livrables conformes',
  EXP: 'Exploration et expertise métier',
  GOV: 'Gouvernance et contrôle',
  QA: 'Qualité et vérification',
};

function capabilitiesOf(domain: string, can: string[]): Capability[] {
  return [
    ...can.map((name, i) => ({
      id: `${domain}-CAP-${String(i + 1).padStart(2, '0')}`,
      name,
      description: `Capacité: ${name}`,
      type: 'can' as const,
    })),
    {
      id: `${domain}-CAP-09`,
      name: 'contourner_les_limites',
      description: 'Capacité interdite pour tout agent',
      type: 'cannot' as const,
    },
  ];
}

function agent(partial: Omit<Agent, 'capabilities' | 'mission'> & { capabilitiesCan?: string[] }): Agent {
  const { capabilitiesCan, ...rest } = partial;
  return {
    ...rest,
    mission: MISSION_BY_DOMAIN[rest.domain],
    capabilities: capabilitiesOf(rest.domain, capabilitiesCan ?? ['traiter_les_taches_confiees']),
  };
}

const CORE_CAN = ['orchestrer_le_gate', 'valider_les_transitions'];
const DEV_CAN = ['produire_des_livrables', 'respecter_les_conventions'];
const EXP_CAN = ['explorer_pour_rediger', 'formuler_des_recettes'];
const GOV_CAN = ['controler_la_structure', 'auditer_les_livrables'];
const QA_CAN = ['verifier_les_livrables', 'emettre_des_alertes'];

const dep = (agentId: string, type: AgentDependency['type'] = 'mandatory'): AgentDependency => ({
  agentId,
  type,
});

export const MOCK_AGENTS: Agent[] = [
  // --- CORE (8) ---
  agent({ id: 'CORE-01', name: 'Orchestrator', version: '1.0.0', domain: 'CORE', criticity: 'critique', status: 'active', responsibilities: ['Coordination des agents', 'Ordonnancement des gates'], limits: ['Simple exécutant', 'Prend exclusivement les décisions d\'ordonnancement'], dependencies: [], capabilitiesCan: CORE_CAN }),
  agent({ id: 'CORE-02', name: 'Gateguard', version: '1.0.0', domain: 'CORE', criticity: 'critique', status: 'active', responsibilities: ['Garant des gates', 'Scoring des livrables'], limits: ['Ne peut valider un livrable sans preuve'], dependencies: [dep('CORE-01')], capabilitiesCan: CORE_CAN }),
  agent({ id: 'CORE-03', name: 'Registrar', version: '1.0.0', domain: 'CORE', criticity: 'haute', status: 'active', responsibilities: ['Tenue du Registry'], limits: ['Le Registry est l\'état réel'], dependencies: [dep('CORE-01')], capabilitiesCan: CORE_CAN }),
  agent({ id: 'CORE-04', name: 'Historian', version: '1.0.0', domain: 'CORE', criticity: 'haute', status: 'active', responsibilities: ['Historique append-only'], limits: ['Interdiction de muter l\'historique'], dependencies: [dep('CORE-01')], capabilitiesCan: CORE_CAN }),
  agent({ id: 'CORE-05', name: 'Validateur', version: '1.0.0', domain: 'CORE', criticity: 'haute', status: 'active', responsibilities: ['Validation des transitions'], limits: ['Ne crée pas d\'agents'], dependencies: [dep('CORE-01')], capabilitiesCan: CORE_CAN }),
  agent({ id: 'CORE-06', name: 'Contrôleur', version: '1.0.0', domain: 'CORE', criticity: 'haute', status: 'active', responsibilities: ['Contrôle des invariants'], limits: ['Signalement uniquement'], dependencies: [dep('CORE-01')], capabilitiesCan: CORE_CAN }),
  agent({ id: 'CORE-07', name: 'Synchroniseur', version: '1.0.0', domain: 'CORE', criticity: 'moyenne', status: 'active', responsibilities: ['Synchronisation des canaux'], limits: ['Pas de write concurrent'], dependencies: [dep('CORE-01')], capabilitiesCan: CORE_CAN }),
  agent({ id: 'CORE-08', name: 'Journaliseur', version: '1.0.0', domain: 'CORE', criticity: 'moyenne', status: 'active', responsibilities: ['Écriture des journaux'], limits: ['Pas de secret en clair'], dependencies: [dep('CORE-01')], capabilitiesCan: CORE_CAN }),

  // --- DEV (10) ---
  agent({ id: 'DEV-01', name: 'Développeur', version: '1.0.0', domain: 'DEV', criticity: 'haute', status: 'active', responsibilities: ['Production de code'], limits: ['Ne peut committer sans gate'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-02', name: 'Intégrateur', version: '1.0.0', domain: 'DEV', criticity: 'haute', status: 'active', responsibilities: ['Intégration continue'], limits: ['Ne modifie pas le Registry'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-03', name: 'Composant', version: '1.0.0', domain: 'DEV', criticity: 'moyenne', status: 'active', responsibilities: ['Composant réutilisable'], limits: ['Respecte les conventions'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-04', name: 'Spécialiste', version: '1.0.0', domain: 'DEV', criticity: 'moyenne', status: 'active', responsibilities: ['Expertise technique'], limits: ['Pas de décision de gate'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-05', name: 'Implémenteur', version: '1.0.0', domain: 'DEV', criticity: 'haute', status: 'active', responsibilities: ['Implémentation'], limits: ['Ne peut valider son propre travail'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-06', name: 'Correcteur', version: '1.0.0', domain: 'DEV', criticity: 'moyenne', status: 'active', responsibilities: ['Corrections'], limits: ['Preuve requise'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-07', name: 'Documentaliste', version: '1.0.0', domain: 'DEV', criticity: 'basse', status: 'active', responsibilities: ['Documentation'], limits: ['Ne crée pas de fichiers hors dépôt'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-08', name: 'Automatiseur', version: '1.0.0', domain: 'DEV', criticity: 'moyenne', status: 'active', responsibilities: ['Automatisation'], limits: ['Pas de secret en clair'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-09', name: 'Responsable technique', version: '1.0.0', domain: 'DEV', criticity: 'haute', status: 'active', responsibilities: ['Direction technique'], limits: ['Pas de décision humaine'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),
  agent({ id: 'DEV-10', name: 'Maintien en condition', version: '1.0.0', domain: 'DEV', criticity: 'moyenne', status: 'active', responsibilities: ['Maintenance évolutive'], limits: ['Fixture ≠ Registry'], dependencies: [dep('CORE-01'), dep('CORE-02')], capabilitiesCan: DEV_CAN }),

  // --- EXP (10) ---
  agent({ id: 'EXP-01', name: 'Rédacteur', version: '1.0.0', domain: 'EXP', criticity: 'moyenne', status: 'active', responsibilities: ['Rédaction de livrables'], limits: ['Pas de gate sans preuve'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-02', name: 'Explorateur', version: '1.0.0', domain: 'EXP', criticity: 'moyenne', status: 'active', responsibilities: ['Exploration métier'], limits: ['Ne modifie pas Registry'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-03', name: 'Synthétiseur', version: '1.0.0', domain: 'EXP', criticity: 'moyenne', status: 'active', responsibilities: ['Synthèses'], limits: ['Source de vérité = Registry'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-04', name: 'Recetteur', version: '1.0.0', domain: 'EXP', criticity: 'basse', status: 'active', responsibilities: ['Recettes reproductibles'], limits: ['Pas de secret'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-05', name: 'Analyste', version: '1.0.0', domain: 'EXP', criticity: 'haute', status: 'active', responsibilities: ['Analyse'], limits: ['Preuves explicites'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-06', name: 'Expert', version: '1.0.0', domain: 'EXP', criticity: 'haute', status: 'active', responsibilities: ['Expertise'], limits: ['Avis ≠ décision'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-07', name: 'Conseiller', version: '1.0.0', domain: 'EXP', criticity: 'basse', status: 'active', responsibilities: ['Conseil'], limits: ['Pas de rôle d\'autorité'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-08', name: 'Veilleur', version: '1.0.0', domain: 'EXP', criticity: 'basse', status: 'active', responsibilities: ['Veille'], limits: ['Reporting uniquement'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-09', name: 'Formulateur', version: '1.0.0', domain: 'EXP', criticity: 'moyenne', status: 'active', responsibilities: ['Formulation de recettes'], limits: ['Clair au niveau de grammaire'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),
  agent({ id: 'EXP-10', name: 'Cartographe', version: '1.0.0', domain: 'EXP', criticity: 'basse', status: 'active', responsibilities: ['Cartographie'], limits: ['Pas de write sur l\'état'], dependencies: [dep('CORE-01')], capabilitiesCan: EXP_CAN }),

  // --- GOV (4) ---
  agent({ id: 'GOV-01', name: 'Gouvernant', version: '1.0.0', domain: 'GOV', criticity: 'critique', status: 'active', responsibilities: ['Gouvernance'], limits: ['Speaker ni président'], dependencies: [dep('CORE-01')], capabilitiesCan: GOV_CAN }),
  agent({ id: 'GOV-02', name: 'Auditeur', version: '1.0.0', domain: 'GOV', criticity: 'critique', status: 'active', responsibilities: ['Audit'], limits: ['Preuve requise'], dependencies: [dep('CORE-01')], capabilitiesCan: GOV_CAN }),
  agent({ id: 'GOV-03', name: 'Secrétaire', version: '1.0.0', domain: 'GOV', criticity: 'haute', status: 'active', responsibilities: ['Tenue des décisions'], limits: ['Ne décide pas'], dependencies: [dep('CORE-01')], capabilitiesCan: GOV_CAN }),
  agent({ id: 'GOV-04', name: 'Garant', version: '1.0.0', domain: 'GOV', criticity: 'haute', status: 'active', responsibilities: ['Garant des invariants'], limits: ['Signalement, pas d\'action'], dependencies: [dep('CORE-01')], capabilitiesCan: GOV_CAN }),

  // --- QA (8) ---
  agent({ id: 'QA-01', name: 'Vérificateur', version: '1.0.0', domain: 'QA', criticity: 'critique', status: 'active', responsibilities: ['Vérification'], limits: ['Ne corrige pas lui-même'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
  agent({ id: 'QA-02', name: 'Testeur', version: '1.0.0', domain: 'QA', criticity: 'haute', status: 'active', responsibilities: ['Tests'], limits: ['Pas de gate invalidé sans preuve'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
  agent({ id: 'QA-03', name: 'Qualiticien', version: '1.0.0', domain: 'QA', criticity: 'haute', status: 'active', responsibilities: ['Qualité'], limits: ['Fix jamais exécuté sur simple ID'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
  agent({ id: 'QA-04', name: 'Contrôleur de qualité', version: '1.0.0', domain: 'QA', criticity: 'haute', status: 'active', responsibilities: ['Contrôle qualité'], limits: ['Preuve systématique'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
  agent({ id: 'QA-05', name: 'Analyste de test', version: '1.0.0', domain: 'QA', criticity: 'moyenne', status: 'active', responsibilities: ['Analyse de test'], limits: ['Pas de secret dans les rapports'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
  agent({ id: 'QA-06', name: 'Inspecteur', version: '1.0.0', domain: 'QA', criticity: 'haute', status: 'active', responsibilities: ['Inspection'], limits: ['Fixture ≠ Registry'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
  agent({ id: 'QA-07', name: 'Préqualifieur', version: '1.0.0', domain: 'QA', criticity: 'moyenne', status: 'active', responsibilities: ['Préqualification'], limits: ['Pas de gate final'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
  agent({ id: 'QA-08', name: 'Validateur qualité', version: '1.0.0', domain: 'QA', criticity: 'haute', status: 'active', responsibilities: ['Validation qualité'], limits: ['Aucun secret exposé'], dependencies: [dep('CORE-01'), dep('DEV-01')], capabilitiesCan: QA_CAN }),
];

export const MOCK_AGENT_COUNT = MOCK_AGENTS.length;