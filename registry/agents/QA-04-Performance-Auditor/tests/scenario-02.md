# Scenario 02 — Profiling applicatif

## Objectif
Vérifier que QA-04 profile une application pour identifier les bottlenecks CPU/mémoire.

## Entrées
- Application déployée sur staging
- Métriques APM disponibles
- Scénario de charge standard

## Étapes
1. Déclencher le profiling via CORE-01
2. QA-04 profile CPU, mémoire et I/O
3. QA-04 analyse les métriques
4. QA-04 produit un rapport détaillé

## Résultat attendu
- Rapport de profiling avec hotspots CPU
- Consommation mémoire par module
- Recommandations d'optimisation transmises à DEV-07
- Seuils d'alerte définis
