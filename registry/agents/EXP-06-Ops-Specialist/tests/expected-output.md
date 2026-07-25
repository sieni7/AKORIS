# Expected Output — EXP-06 Ops Specialist

## Scenario 01 — Panne applicative

| Step | Output |
|------|--------|
| 1 | Incident `INC-2026-001` créé via PagerDuty |
| 2 | Dashboard `payment-api` : CPU 95%, Memory 80%, Latency > 5s |
| 3 | Cause racine : thread pool épuisé (deadlock) |
| 4 | Runbook RB-PAY-001 exécuté : restart du service |
| 5 | Latence revenue à 150ms, erreur 0% |
| 6 | Post-mortem planifié avec l'équipe |

**MTTR:** 22 min ✓

## Scenario 02 — Dégradation progressive

| Step | Output |
|------|--------|
| 1 | Tendance : temps requête +30% sur 48h |
| 2 | Logs : requêtes `SELECT * FROM orders` sans index |
| 3 | Cause : `orders.status` non indexé |
| 4 | Alerte `PG-CONN-90` créée (seuil 90%) |
| 5 | Runbook `RB-DB-OPT-001` livré |
| 6 | Escalade vers CORE-07 pour création d'index |

**Délai détection:** 30 min (proactif, avant tout incident)
