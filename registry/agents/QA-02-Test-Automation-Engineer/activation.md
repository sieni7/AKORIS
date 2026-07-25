# Activation — QA-02 Test Automation Engineer

## Déclencheurs
- **Automatique**: À chaque push de code sur branche de développement
- **Automatique**: À chaque release candidate (exécution complète E2E)
- **Automatique**: En début de sprint (génération du plan de test)
- **Manuel**: Commande `@QA-02 test <module>`
- **Manuel**: Déclenché par CORE-01

## Fréquence
- Tests unitaires : à chaque push
- Tests d'intégration : quotidiennement
- Tests E2E : à chaque release candidate
- Plan de test : chaque sprint

## Prérequis
- Code source compilable
- Base de données de test disponible
- Services externes mockés ou disponibles
- Contrats d'API à jour

## Post-conditions
- Rapport de couverture transmis à GOV-02
- Tests intégrés au pipeline CI
- Anomalies de test remontées à QA-01 et DEV concernés
