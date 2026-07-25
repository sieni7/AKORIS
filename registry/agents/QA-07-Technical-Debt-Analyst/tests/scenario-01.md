# Scenario 01: Analyse dette technique sprint

**Objectif:** Analyser et prioriser la dette technique identifiée dans le sprint.

## Préconditions
- Code source du sprint disponible
- Métriques SonarQube exportées
- Historique des 3 derniers sprints

## Déroulement
1. Activer QA-07 avec `akoris activate QA-07`
2. Fournir le rapport SonarQube
3. Lancer l'analyse de dette
4. Classifier par type et sévérité
5. Générer le backlog priorisé

## Résultats attendus
- Rapport de dette technique
- Backlog priorisé avec estimations
- Métriques d'évolution
- Plan de remboursement

## Critères de succès
- Ratio dette < 5%
- Dette critique = 0
- Tendance à la baisse
