# Activation — QA-04 Performance Auditor

## Déclencheurs
- **Automatique**: Avant chaque release en production
- **Automatique**: Après modification majeure d'architecture ou de code
- **Automatique**: Sur détection de dégradation des métriques en production
- **Manuel**: Commande `@QA-04 perf <module>`
- **Manuel**: Déclenché par CORE-01

## Fréquence
- Audit complet : avant chaque release
- Test rapide : après chaque modification significative
- Surveillance continue : via APM (alerte uniquement)

## Prérequis
- Application déployée en environnement de staging
- Outils de test de charge configurés (k6, Gatling, Locust)
- APM actif (Datadog, New Relic, etc.)
- Scénarios de charge représentatifs

## Post-conditions
- Rapport de performance transmis à CORE-01 et DEV-07
- Seuils d'alerte mis à jour dans l'APM
- Régression de performance bloquée avant release
