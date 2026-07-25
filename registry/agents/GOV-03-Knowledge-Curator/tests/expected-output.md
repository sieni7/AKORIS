# Expected Output — GOV-03 Knowledge Curator

## Scenario 01 — Post-mortem d'incident critique

| Step | Output |
|------|--------|
| 1 | Timeline collectée : 15 min d'incident, 5 actions |
| 2 | Post-mortem J+2 : participants EXP-06, CORE-07 |
| 3 | Rapport `PM-2026-001` : 5 Why → deadlock thread pool, correction appliquée |
| 4 | KB mise à jour : fiche `thread-pool-deadlock` créée |
| 5 | Leçons publiées : 3 actions préventives (monitoring pool, alerting seuil, runbook) |
| 6 | Suivi adoption planifié à J+30 |

**Délai post-mortem:** 2 jours (objectif < 5 jours ✓)  
**Incidents avec post-mortem:** 100% ✓  
**KB freshness:** Mise à jour J+2 (objectif < 1 sprint ✓)

## Scenario 02 — Veille technologique PostgreSQL 17

| Step | Output |
|------|--------|
| 1 | Analyse : 12 changements, 3 impacts majeurs (partitioning, replication, perf) |
| 2 | Impact : projets utilisant PG 16 concernés (migration recommandée Q3) |
| 3 | KB mise à jour : fiches `postgresql-17-migration`, `pg17-new-features` |
| 4 | Note de veille `WATCH-2026-008` diffusée à DEV-02, CORE-04 |
| 5 | Migration planifiée : Proof of Concept J+15, migration groupe A J+45 |
| 6 | Suivi adoption : 60% à J+30, objectif > 80% |

**Délai veille:** 3 jours (objectif < 1 semaine ✓)  
**KB freshness:** Mise à jour J+3 ✓  
**Lesson adoption (cible):** > 80%
