# Quality Gates — EXP-06 Ops Specialist

## QG-OPS-001 — Couverture monitoring
**Critique:** haute
**Critères:**
- Tous les services critiques monitorés
- Métriques CPU, mémoire, latence, throughput collectées
- Health checks en place
- Couverture > 90%

## QG-OPS-002 — Qualité des alertes
**Critique:** haute
**Critères:**
- Aucun faux positif identifié sur les 7 derniers jours
- Chaque alerte a un runbook associé
- Seuils d'alerting calibrés et validés
- Escalation matrix documentée

## QG-OPS-003 — SLO conformes
**Critique:** standard
**Critères:**
- SLI définis pour chaque service
- SLO respectés sur la fenêtre glissante
- Burn rate alerts configurées

## Processus de validation
1. Vérification automatisée par EXP-06
2. Revue trimestrielle avec QA-04 et CORE-07
