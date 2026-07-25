# Expected Output — GOV-02 Quality Gate Keeper

## Scenario 01 — Gate de transition Développement → Test

| Step | Output |
|------|--------|
| 1 | Critères QG récupérés : 6 critères (couverture test > 80%, code review passée, etc.) |
| 2 | Vérification : 5/6 OK, 1 alerte (couverture test 85% > 80% ✓) |
| 3 | Décision : **GO** |
| 4 | Justification : tous les critères QG satisfaits |
| 5 | Notification : CORE-01, équipe projet, GOV-01 |

**Délai:** 2h (objectif < 4h ✓)  
**Décision:** GO — Transition autorisée vers phase Test  
**Trace:** `GATE-DEV-TEST-2026-042`

## Scenario 02 — Blocage de release

| Step | Output |
|------|--------|
| 1 | CVE-2026-1234 : score CVSS 9.8, impact critique |
| 2 | Critère QG-SEC-01 : 0 vulnérabilité critique en release |
| 3 | Décision : **BLOCKED** |
| 4 | Escalade : `ESC-2026-015` vers CORE-01 |
| 5 | Plan : correction en cours (48h), re-audit QA-03 |
| 6 | Condition : déblocage après validation QA-03 |

**Blocking accuracy:** 100% ✓  
**Délai décision:** 30 min (urgence traitée)  
**Statut:** Release bloquée, corrective actions en cours
