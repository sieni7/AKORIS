# Scenario 02 — Dégradation progressive des performances

## Contexte

Le monitoring détecte une dégradation lente des performances d'une base de données depuis 48h.

## Entrées

- Service: `postgres-primary`
- Métriques: temps de requête +30%, connexions à 85% du max
- Pas d'alerte immédiate, tendance progressive

## Déroulement attendu

1. EXP-06 analyse la tendance sur les dashboards
2. Corrèle avec les logs de requêtes lentes
3. Identifie une absence d'index sur une table critique
4. Crée une alerte proactive de seuil (90% connexions)
5. Propose un runbook d'optimisation de requêtes
6. Escalade à CORE-07 pour l'indexation

## Critères de succès

- Détection avant impact critique
- Nouvelle alerte proactive configurée
- Runbook d'optimisation livré
