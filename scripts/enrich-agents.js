#!/usr/bin/env node
/**
 * enrich-agents.js — Enrichit les agents avec dependencies, capabilities et RACI.
 *
 * Principes :
 *   - agent.json est la source de vérité du contenu ; ce script est un script
 *     de MAINTENANCE qui n'ajoute que les champs MANQUANTS (jamais d'écrasement)
 *   - écrit dans agent.json : dependencies, capabilities
 *   - écrit dans contract.json : dependencies, capabilities, raci
 *   - ne touche NI capabilities.json (géré par generate-agent-files.js)
 *             NI prompt.md (géré par enrich-prompts.js)
 *   - idempotent : une seconde exécution ne modifie rien
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, 'registry', 'agents');

// Données réelles par agent (40 entrées).
// Seuls les champs manquants sont ajoutés ; les champs existants sont préservés.

const AGENT_DATA = {
  // CORE (8)
  'CORE-01': {
    dependencies: [],
    capabilities: [
      { id: 'orchestrate', name: 'Orchestrer', description: 'Coordonner tous les agents', type: 'can' },
      { id: 'arbitrate', name: 'Arbitrer', description: 'Résoudre les conflits', type: 'can' },
      { id: 'validate_transition', name: 'Valider les transitions', description: "Valider les transitions d'état", type: 'can' }
    ],
    raci: { R: ['CORE-01'], A: ['GOV-01'], C: ['CORE-02', 'CORE-03'], I: ['GOV-01', 'GOV-02'] }
  },
  'CORE-02': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'design_architecture', name: "Concevoir l'architecture", description: "Définir l'architecture globale", type: 'can' },
      { id: 'create_adr', name: 'Créer des ADR', description: 'Documenter les décisions architecturales', type: 'can' },
      { id: 'define_modules', name: 'Définir les modules', description: 'Définir le découpage applicatif', type: 'can' }
    ],
    raci: { R: ['CORE-02'], A: ['CORE-01'], C: ['DEV-01', 'DEV-02'], I: ['GOV-01'] }
  },
  'CORE-03': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'prioritize_backlog', name: 'Prioriser le backlog', description: 'Prioriser les fonctionnalités', type: 'can' },
      { id: 'validate_functional', name: 'Valider fonctionnel', description: 'Valider les livrables fonctionnels', type: 'can' },
      { id: 'define_requirements', name: 'Définir les exigences', description: 'Définir les exigences métier', type: 'can' }
    ],
    raci: { R: ['CORE-03'], A: ['CORE-01'], C: ['DEV-01', 'DEV-02', 'QA-01'], I: ['GOV-01'] }
  },
  'CORE-04': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'design_database', name: 'Concevoir la base de données', description: 'Définir le modèle de données', type: 'can' },
      { id: 'optimize_sql', name: 'Optimiser les requêtes SQL', description: 'Optimiser les performances SQL', type: 'can' },
      { id: 'migrate_data', name: 'Migrer les données', description: 'Gérer les migrations de données', type: 'can' }
    ],
    raci: { R: ['CORE-04'], A: ['CORE-01'], C: ['DEV-02', 'DEV-07'], I: ['GOV-01'] }
  },
  'CORE-05': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'define_security', name: 'Définir la sécurité', description: 'Définir les exigences de sécurité', type: 'can' },
      { id: 'audit_security', name: 'Auditer la sécurité', description: 'Auditer la sécurité du système', type: 'can' },
      { id: 'comply', name: 'Assurer la conformité', description: 'Assurer la conformité aux normes', type: 'can' }
    ],
    raci: { R: ['CORE-05'], A: ['CORE-01'], C: ['DEV-02', 'DEV-03'], I: ['GOV-01', 'GOV-02'] }
  },
  'CORE-06': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'write_docs', name: 'Rédiger la documentation', description: 'Rédiger la documentation technique', type: 'can' },
      { id: 'maintain_adr', name: 'Maintenir les ADR', description: 'Maintenir les décisions architecturales', type: 'can' },
      { id: 'capitalize_knowledge', name: 'Capitaliser les connaissances', description: 'Capitaliser les connaissances du projet', type: 'can' }
    ],
    raci: { R: ['CORE-06'], A: ['CORE-01'], C: ['QA-06'], I: ['GOV-01'] }
  },
  'CORE-07': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'setup_ci_cd', name: 'Configurer CI/CD', description: 'Configurer les pipelines CI/CD', type: 'can' },
      { id: 'deploy', name: 'Déployer', description: 'Déployer les applications', type: 'can' },
      { id: 'observability', name: 'Observabilité', description: "Configurer l'observabilité", type: 'can' }
    ],
    raci: { R: ['CORE-07'], A: ['CORE-01'], C: ['DEV-08'], I: ['GOV-01'] }
  },
  'CORE-08': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'define_quality_gates', name: 'Définir les Quality Gates', description: 'Définir les points de contrôle qualité', type: 'can' },
      { id: 'supervise_audit', name: 'Superviser les audits', description: 'Superviser les audits qualité', type: 'can' },
      { id: 'enforce_compliance', name: 'Imposer la conformité', description: 'Imposer la conformité globale', type: 'can' }
    ],
    raci: { R: ['CORE-08'], A: ['CORE-01'], C: ['QA-01', 'QA-07'], I: ['GOV-01', 'GOV-02'] }
  },
  // DEV (10)
  'DEV-01': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'design_frontend', name: 'Concevoir le frontend', description: "Concevoir l'architecture frontend", type: 'can' },
      { id: 'design_system', name: 'Design system', description: 'Définir le design system', type: 'can' },
      { id: 'optimize_ui', name: "Optimiser l'UI", description: 'Optimiser les performances UI', type: 'can' }
    ],
    raci: { R: ['DEV-01'], A: ['CORE-01'], C: ['DEV-05'], I: ['GOV-01'] }
  },
  'DEV-02': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'design_backend', name: 'Concevoir le backend', description: "Concevoir l'architecture backend", type: 'can' },
      { id: 'design_services', name: 'Concevoir les services', description: 'Concevoir les services métier', type: 'can' },
      { id: 'integrate_systems', name: 'Intégrer les systèmes', description: 'Intégrer les systèmes', type: 'can' }
    ],
    raci: { R: ['DEV-02'], A: ['CORE-01'], C: ['DEV-03', 'DEV-04'], I: ['GOV-01'] }
  },
  'DEV-03': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'design_api', name: "Concevoir l'API", description: 'Concevoir les contrats API', type: 'can' },
      { id: 'write_openapi', name: 'Rédiger OpenAPI', description: 'Rédiger les spécifications OpenAPI', type: 'can' },
      { id: 'version_api', name: "Versionner l'API", description: 'Versionner les API', type: 'can' }
    ],
    raci: { R: ['DEV-03'], A: ['CORE-01'], C: ['DEV-02', 'DEV-08'], I: ['GOV-01'] }
  },
  'DEV-04': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'model_domain', name: 'Modéliser le domaine', description: 'Modéliser le domaine métier', type: 'can' },
      { id: 'ddd', name: 'DDD', description: 'Appliquer les principes DDD', type: 'can' },
      { id: 'define_business_rules', name: 'Définir les règles métier', description: 'Définir les règles métier', type: 'can' }
    ],
    raci: { R: ['DEV-04'], A: ['CORE-01'], C: ['DEV-02'], I: ['GOV-01'] }
  },
  'DEV-05': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'design_ux', name: "Concevoir l'UX", description: "Concevoir l'expérience utilisateur", type: 'can' },
      { id: 'accessibility', name: 'Accessibilité', description: "Assurer l'accessibilité", type: 'can' },
      { id: 'responsive_design', name: 'Responsive design', description: 'Concevoir des interfaces responsives', type: 'can' }
    ],
    raci: { R: ['DEV-05'], A: ['CORE-01'], C: ['DEV-01'], I: ['GOV-01'] }
  },
  'DEV-06': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'pwa', name: 'PWA', description: 'Développer des Progressive Web Apps', type: 'can' },
      { id: 'offline', name: 'Offline', description: 'Gérer le mode offline', type: 'can' },
      { id: 'notifications', name: 'Notifications', description: 'Gérer les notifications push', type: 'can' }
    ],
    raci: { R: ['DEV-06'], A: ['CORE-01'], C: ['DEV-01'], I: ['GOV-01'] }
  },
  'DEV-07': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'optimize_performance', name: 'Optimiser les performances', description: 'Optimiser les performances globales', type: 'can' },
      { id: 'caching', name: 'Cache', description: 'Gérer le cache', type: 'can' },
      { id: 'load_testing', name: 'Tests de charge', description: 'Effectuer des tests de charge', type: 'can' }
    ],
    raci: { R: ['DEV-07'], A: ['CORE-01'], C: ['QA-04'], I: ['GOV-01'] }
  },
  'DEV-08': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'integrate_third_party', name: 'Intégrer des services tiers', description: 'Intégrer des services tiers', type: 'can' },
      { id: 'api_connectors', name: 'Connecteurs API', description: 'Créer des connecteurs API', type: 'can' },
      { id: 'sdk_integration', name: 'SDK', description: 'Intégrer des SDK', type: 'can' }
    ],
    raci: { R: ['DEV-08'], A: ['CORE-01'], C: ['CORE-07'], I: ['GOV-01'] }
  },
  'DEV-09': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'test_strategy', name: 'Stratégie de test', description: 'Définir la stratégie de test', type: 'can' },
      { id: 'reliability', name: 'Fiabilité', description: 'Assurer la fiabilité', type: 'can' },
      { id: 'chaos_engineering', name: 'Chaos Engineering', description: 'Mettre en place le Chaos Engineering', type: 'can' }
    ],
    raci: { R: ['DEV-09'], A: ['CORE-01'], C: ['QA-01', 'QA-02'], I: ['GOV-01'] }
  },
  'DEV-10': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-02', type: 'mandatory', description: "Nécessite l'architecture technique" }],
    capabilities: [
      { id: 'developer_experience', name: "Expérience développeur", description: "Optimiser l'expérience développeur", type: 'can' },
      { id: 'dev_environment', name: 'Environnement de développement', description: 'Configurer les environnements de développement', type: 'can' },
      { id: 'onboarding', name: 'Onboarding', description: "Faciliter l'onboarding des développeurs", type: 'can' }
    ],
    raci: { R: ['DEV-10'], A: ['CORE-01'], C: ['CORE-06'], I: ['GOV-01'] }
  },
  // QA (8)
  'QA-01': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'review_code', name: 'Reviewer le code', description: 'Reviewer le code', type: 'can' },
      { id: 'ensure_quality', name: 'Assurer la qualité', description: 'Assurer la qualité du code', type: 'can' },
      { id: 'best_practices', name: 'Bonnes pratiques', description: 'Appliquer les bonnes pratiques', type: 'can' }
    ],
    raci: { R: ['QA-01'], A: ['CORE-08'], C: ['DEV-01', 'DEV-02'], I: ['GOV-01'] }
  },
  'QA-02': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'test_automation', name: 'Automatiser les tests', description: 'Automatiser les tests', type: 'can' },
      { id: 'unit_tests', name: 'Tests unitaires', description: 'Écrire des tests unitaires', type: 'can' },
      { id: 'e2e_tests', name: 'Tests E2E', description: 'Écrire des tests end-to-end', type: 'can' }
    ],
    raci: { R: ['QA-02'], A: ['CORE-08'], C: ['DEV-01', 'DEV-02'], I: ['GOV-01'] }
  },
  'QA-03': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'audit_security', name: 'Auditer la sécurité', description: 'Auditer la sécurité du système', type: 'can' },
      { id: 'vulnerability_scan', name: 'Scanner les vulnérabilités', description: 'Scanner les vulnérabilités', type: 'can' },
      { id: 'security_recommendations', name: 'Recommandations de sécurité', description: 'Formuler des recommandations de sécurité', type: 'can' }
    ],
    raci: { R: ['QA-03'], A: ['CORE-08'], C: ['CORE-05'], I: ['GOV-01', 'GOV-02'] }
  },
  'QA-04': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'audit_performance', name: 'Auditer les performances', description: 'Auditer les performances', type: 'can' },
      { id: 'bottleneck_analysis', name: 'Analyse des goulots', description: "Identifier les goulots d'étranglement", type: 'can' },
      { id: 'performance_report', name: 'Rapport de performance', description: 'Produire un rapport de performance', type: 'can' }
    ],
    raci: { R: ['QA-04'], A: ['CORE-08'], C: ['DEV-07'], I: ['GOV-01'] }
  },
  'QA-05': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'audit_accessibility', name: "Auditer l'accessibilité", description: "Auditer l'accessibilité WCAG", type: 'can' },
      { id: 'accessibility_report', name: "Rapport d'accessibilité", description: "Produire un rapport d'accessibilité", type: 'can' },
      { id: 'accessibility_recommendations', name: 'Recommandations WCAG', description: 'Formuler des recommandations WCAG', type: 'can' }
    ],
    raci: { R: ['QA-05'], A: ['CORE-08'], C: ['DEV-05'], I: ['GOV-01'] }
  },
  'QA-06': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'audit_documentation', name: 'Auditer la documentation', description: 'Auditer la documentation', type: 'can' },
      { id: 'doc_coherence', name: 'Cohérence documentaire', description: 'Vérifier la cohérence de la documentation', type: 'can' },
      { id: 'doc_completeness', name: 'Exhaustivité documentaire', description: "Vérifier l'exhaustivité de la documentation", type: 'can' }
    ],
    raci: { R: ['QA-06'], A: ['CORE-08'], C: ['CORE-06'], I: ['GOV-01'] }
  },
  'QA-07': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'analyze_technical_debt', name: 'Analyser la dette technique', description: 'Analyser la dette technique', type: 'can' },
      { id: 'prioritize_debt', name: 'Prioriser la dette', description: 'Prioriser les éléments de dette', type: 'can' },
      { id: 'debt_report', name: 'Rapport de dette', description: 'Produire un rapport de dette technique', type: 'can' }
    ],
    raci: { R: ['QA-07'], A: ['CORE-08'], C: ['DEV-01', 'DEV-02'], I: ['GOV-01'] }
  },
  'QA-08': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }, { agentId: 'CORE-08', type: 'mandatory', description: 'Nécessite la gouvernance QA' }],
    capabilities: [
      { id: 'usability_test', name: "Tester l'utilisabilité", description: "Tester l'utilisabilité des interfaces", type: 'can' },
      { id: 'ux_audit', name: 'Audit UX', description: "Auditer l'expérience utilisateur", type: 'can' },
      { id: 'ux_recommendations', name: 'Recommandations UX', description: 'Formuler des recommandations UX', type: 'can' }
    ],
    raci: { R: ['QA-08'], A: ['CORE-08'], C: ['DEV-05'], I: ['GOV-01'] }
  },
  // EXP (10)
  'EXP-01': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'optimize_prompts', name: 'Optimiser les prompts', description: 'Optimiser les prompts IA', type: 'can' },
      { id: 'multi_agent_orchestration', name: 'Orchestration multi-agents', description: 'Orchestrer les agents IA', type: 'can' },
      { id: 'cost_optimization', name: 'Optimiser les coûts', description: "Optimiser les coûts d'IA", type: 'can' }
    ],
    raci: { R: ['EXP-01'], A: ['CORE-01'], C: ['DEV-01', 'DEV-02'], I: ['GOV-01'] }
  },
  'EXP-02': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'multi_tenant', name: 'Multi-tenant', description: 'Concevoir des architectures multi-tenant', type: 'can' },
      { id: 'saas_billing', name: 'Facturation SaaS', description: 'Concevoir des systèmes de facturation SaaS', type: 'can' },
      { id: 'saas_metrics', name: 'Indicateurs SaaS', description: 'Définir les indicateurs SaaS', type: 'can' }
    ],
    raci: { R: ['EXP-02'], A: ['CORE-01'], C: ['DEV-02'], I: ['GOV-01'] }
  },
  'EXP-03': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'mobile_development', name: 'Développement mobile', description: 'Développer des applications mobiles', type: 'can' },
      { id: 'sync', name: 'Synchronisation', description: 'Gérer la synchronisation des données', type: 'can' },
      { id: 'ios_android', name: 'iOS/Android', description: 'Connaître les contraintes iOS/Android', type: 'can' }
    ],
    raci: { R: ['EXP-03'], A: ['CORE-01'], C: ['DEV-01'], I: ['GOV-01'] }
  },
  'EXP-04': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'etl', name: 'ETL', description: 'Concevoir des pipelines ETL', type: 'can' },
      { id: 'data_pipelines', name: 'Pipelines de données', description: 'Concevoir des pipelines de données', type: 'can' },
      { id: 'analytics', name: 'Analytique', description: 'Concevoir des traitements analytiques', type: 'can' }
    ],
    raci: { R: ['EXP-04'], A: ['CORE-01'], C: ['CORE-04'], I: ['GOV-01'] }
  },
  'EXP-05': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'rgpd_compliance', name: 'Conformité RGPD', description: 'Assurer la conformité RGPD', type: 'can' },
      { id: 'iso_compliance', name: 'Conformité ISO', description: 'Assurer la conformité ISO', type: 'can' },
      { id: 'audit_compliance', name: 'Audit de conformité', description: 'Auditer la conformité', type: 'can' }
    ],
    raci: { R: ['EXP-05'], A: ['CORE-01'], C: ['CORE-05'], I: ['GOV-01', 'GOV-02'] }
  },
  'EXP-06': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'monitoring', name: 'Supervision', description: 'Superviser les applications', type: 'can' },
      { id: 'alerting', name: 'Alerting', description: 'Configurer les alertes', type: 'can' },
      { id: 'observability', name: 'Observabilité', description: "Assurer l'observabilité", type: 'can' }
    ],
    raci: { R: ['EXP-06'], A: ['CORE-01'], C: ['CORE-07'], I: ['GOV-01'] }
  },
  'EXP-07': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'standardize', name: 'Standardiser', description: 'Standardiser les processus', type: 'can' },
      { id: 'templates', name: 'Templates', description: 'Créer des templates réutilisables', type: 'can' },
      { id: 'reproducibility', name: 'Reproductibilité', description: 'Assurer la reproductibilité', type: 'can' }
    ],
    raci: { R: ['EXP-07'], A: ['CORE-01'], C: ['GOV-01'], I: ['GOV-01'] }
  },
  'EXP-08': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'evaluate_models', name: 'Évaluer les modèles', description: 'Évaluer les modèles LLM', type: 'can' },
      { id: 'bias_detection', name: 'Détection des biais', description: 'Détecter les biais', type: 'can' },
      { id: 'ethical_audit', name: 'Audit éthique', description: "Auditer l'éthique des prompts", type: 'can' }
    ],
    raci: { R: ['EXP-08'], A: ['CORE-01'], C: ['EXP-01'], I: ['GOV-01'] }
  },
  'EXP-09': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'carbon_footprint', name: 'Empreinte carbone', description: "Optimiser l'empreinte carbone", type: 'can' },
      { id: 'energy_metrics', name: 'Métriques énergétiques', description: 'Suivre les métriques énergétiques', type: 'can' },
      { id: 'green_optimization', name: 'Optimisation verte', description: 'Optimiser les ressources', type: 'can' }
    ],
    raci: { R: ['EXP-09'], A: ['CORE-01'], C: ['EXP-06'], I: ['GOV-01'] }
  },
  'EXP-10': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'platform_design', name: 'Concevoir la plateforme', description: 'Concevoir la plateforme interne', type: 'can' },
      { id: 'self_service', name: 'Self-service', description: 'Mettre en place le self-service', type: 'can' },
      { id: 'abstraction', name: 'Abstraction', description: 'Abstraire les environnements', type: 'can' }
    ],
    raci: { R: ['EXP-10'], A: ['CORE-01'], C: ['CORE-07', 'DEV-08'], I: ['GOV-01'] }
  },
  // GOV (4)
  'GOV-01': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'guard_methodology', name: 'Garder la méthodologie', description: "Garantir l'application de la méthode AKORIS", type: 'can' },
      { id: 'audit_compliance', name: 'Auditer la conformité', description: 'Auditer la conformité méthodologique', type: 'can' },
      { id: 'evolve_standard', name: 'Faire évoluer le standard', description: 'Faire évoluer le standard méthodologique', type: 'can' }
    ],
    raci: { R: ['GOV-01'], A: ['CORE-01'], C: ['GOV-02', 'GOV-03'], I: ['CORE-01'] }
  },
  'GOV-02': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'authorize_gates', name: 'Autoriser les gates', description: 'Autoriser ou refuser les Quality Gates', type: 'can' },
      { id: 'validate_criteria', name: 'Valider les critères', description: 'Valider les critères des gates', type: 'can' },
      { id: 'enforce_quality', name: 'Imposer la qualité', description: 'Imposer les règles de qualité', type: 'can' }
    ],
    raci: { R: ['GOV-02'], A: ['CORE-01'], C: ['CORE-08'], I: ['GOV-01'] }
  },
  'GOV-03': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'curate_knowledge', name: 'Capitaliser les connaissances', description: 'Capitaliser les connaissances', type: 'can' },
      { id: 'retex', name: 'RETEX', description: "Capitaliser les retours d'expérience", type: 'can' },
      { id: 'knowledge_base', name: 'Base de connaissances', description: 'Maintenir la base de connaissances', type: 'can' }
    ],
    raci: { R: ['GOV-03'], A: ['CORE-01'], C: ['CORE-06'], I: ['GOV-01'] }
  },
  'GOV-04': {
    dependencies: [{ agentId: 'CORE-01', type: 'mandatory', description: "Nécessite l'Orchestrator pour la coordination" }],
    capabilities: [
      { id: 'manage_release', name: 'Gérer les releases', description: 'Superviser les processus de release', type: 'can' },
      { id: 'changelog', name: 'CHANGELOG', description: 'Gérer les changelogs', type: 'can' },
      { id: 'value_stream', name: 'Value Stream', description: 'Superviser la valeur métier', type: 'can' }
    ],
    raci: { R: ['GOV-04'], A: ['CORE-01'], C: ['GOV-01'], I: ['GOV-02'] }
  }
};

function mergeAgentData(agent, data) {
  if (!data) return agent;
  if (!agent.dependencies && data.dependencies !== undefined) {
    agent.dependencies = data.dependencies;
  }
  if (!agent.capabilities && data.capabilities !== undefined) {
    agent.capabilities = data.capabilities;
  }
  return agent;
}

function mergeContractData(contract, data) {
  if (!data) return contract;
  if (!contract.raci && data.raci !== undefined) {
    contract.raci = data.raci;
  }
  if (!contract.dependencies && data.dependencies !== undefined) {
    contract.dependencies = data.dependencies;
  }
  if (!contract.capabilities && data.capabilities !== undefined) {
    contract.capabilities = data.capabilities;
  }
  return contract;
}

function main() {
  const dirs = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  console.log('🔧 Enrichissement des agents...\n');

  let enriched = 0;

  for (const id of dirs) {
    const data = AGENT_DATA[id];
    if (!data) {
      console.log(`⏭️  ${id}: aucune donnée d'enrichissement`);
      continue;
    }

    const agentPath = path.join(AGENTS_DIR, id, 'agent.json');
    if (fs.existsSync(agentPath)) {
      const agent = JSON.parse(fs.readFileSync(agentPath, 'utf-8'));
      const updated = mergeAgentData(agent, data);
      fs.writeFileSync(agentPath, JSON.stringify(updated, null, 2) + '\n');
      enriched++;
    }

    const contractPath = path.join(AGENTS_DIR, id, 'contract.json');
    if (fs.existsSync(contractPath)) {
      const contract = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
      const updated = mergeContractData(contract, data);
      fs.writeFileSync(contractPath, JSON.stringify(updated, null, 2) + '\n');
    }
  }

  console.log(`✅ Agent.json + contract.json enrichis pour ${enriched} agents`);
}

module.exports = { AGENT_DATA, mergeAgentData, mergeContractData };

if (require.main === module) {
  main();
}
