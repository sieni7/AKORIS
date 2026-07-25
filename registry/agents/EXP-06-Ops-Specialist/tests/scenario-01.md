# Scenario 01 — Panne applicative et reprise

## Contexte

Un service de paiement en production ne répond plus. Les alertes de latence déclenchent un incident critique.

## Entrées

- Service: `payment-api`
- Métriques: latence > 5s, taux d'erreur 15%
- Alerte: `P1 - LatencyBreach`

## Déroulement attendu

1. EXP-06 reçoit l'alerte et accuse réception
2. Analyse les dashboards monitoring et les logs centralisés
3. Identifie la cause racine via le tracing distribué
4. Applique le runbook `RB-PAY-001` (restart du service)
5. Confirme le retour à la normale (latence < 200ms)
6. Planifie un post-mortem avec l'équipe

## Critères de succès

- MTTR < 30 min
- Aucun faux positif dans la détection
- Runbook mis à jour si écart constaté
