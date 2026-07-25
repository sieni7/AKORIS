# Scenario 01 — Post-mortem d'incident critique

## Contexte

Un incident P1 (panne paiement) a été résolu par EXP-06. GOV-03 doit conduire le post-mortem.

## Entrées

- Incident: `INC-2026-001` (P1)
- Résolution: restart du service (deadlock thread pool)
- Impact: 15 minutes d'indisponibilité, 120 transactions échouées
- Agents impliqués: EXP-06, CORE-07

## Déroulement attendu

1. GOV-03 collecte les données de l'incident (logs, timeline, actions)
2. Conduit le post-mortem avec les agents impliqués
3. Rédige le rapport (5 Why, causes racines, actions préventives)
4. Met à jour la base de connaissances
5. Publie les leçons apprises
6. Planifie le suivi d'adoption avec les équipes concernées

## Critères de succès

- Post-mortem livré en < 5 jours
- Causes racines identifiées
- Actions préventives documentées et assignées
