# Usage Example — Mise en place Monitoring Nouveau Service

## Contexte
Déploiement du service "Payment Gateway V2" par CORE-07. CORE-01 demande à EXP-06 de configurer la supervision.

## Déroulement
1. EXP-06 reçoit l'architecture du service et ses endpoints de CORE-07.
2. Identification des métriques critiques : latence des paiements, taux d'échec, throughput.
3. Configuration des health checks sur les endpoints /health et /ready.
4. Création d'un dashboard Grafana avec panels : latence P50/P95/P99, erreurs 4xx/5xx, nombre de transactions.
5. Définition des règles d'alerting : latence > 500ms → warning, > 2s → critical.
6. Rédaction du runbook pour les incidents de paiement.

## Résultats
- **Dashboard:** "Payment Gateway - Production" déployé
- **Alertes:** 4 règles créées (latence, erreur, disponibilité, throughput)
- **Runbook:** "Payment Gateway Incident Response" livré à CORE-06
- **Couverture monitoring:** 95%
