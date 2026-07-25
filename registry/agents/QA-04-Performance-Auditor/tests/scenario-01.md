# Scenario 01 — Test de charge sur API REST

## Objectif
Vérifier que QA-04 exécute un test de charge et mesure les performances.

## Entrées
- Endpoint: `POST /api/v1/orders`
- Charge: 1000 utilisateurs simultanés
- Durée: 5 minutes

## Étapes
1. Déclencher le test via CORE-01
2. QA-04 exécute le test de charge
3. QA-04 profile l'application
4. QA-04 produit le rapport

## Résultat attendu
- Rapport de performance complet
- P95 < 500ms
- Débit cible atteint (100%)
- Goulots d'étranglement identifiés
