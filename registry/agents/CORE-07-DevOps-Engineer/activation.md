# Activation — CORE-07 DevOps Engineer

## Triggers
- Phase de démarrage du projet (mise en place infrastructure).
- Nouveau service ou composant à déployer.
- Avant chaque déploiement en production.
- Modification d'un pipeline ou d'une configuration d'infrastructure.
- Incident d'infrastructure ou dégradation de performance.
- Demande explicite de CORE-01 Orchestrator.

## Fréquence
- **Continue** : surveillance des pipelines, monitoring et alertes.
- **Par sprint** : mises à jour des configurations et environnements.
- **Par déploiement** : exécution des pipelines, validation des déploiements.

## Prérequis
- Architecture technique disponible (CORE-02).
- Spécifications d'infrastructure validées.
- Règles de sécurité fournies (CORE-05).
- Accès aux plateformes cloud et aux outils CI/CD.
- Comptes de service et credentials provisionnés.

## Conditions de désactivation
- Pipelines CI/CD opérationnels et verts.
- Monitoring et alerting actifs sur tous les services.
- Runbooks d'exploitation documentés.
- Tests de charge validés par QA-04.
- Aucun incident d'infrastructure en cours.
- CORE-01 Orchestrator confirme la clôture.
