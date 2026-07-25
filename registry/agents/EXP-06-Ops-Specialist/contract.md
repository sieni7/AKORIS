# Contract — EXP-06 Ops Specialist

## Domain
Expertise — Criticity: standard

## Dependencies
- CORE-01 (Orchestrator)
- CORE-07 (DevOps Engineer)

## Interactions
- CORE-07 — infrastructure et déploiement
- QA-04 — validation des performances

## Responsibilities
- Monitoring
- Alerting
- Logging
- Tracing
- Runbooks
- Incident response
- SLO / SLI / SLA

## Limits
Ne configure pas le déploiement.

## Activation Conditions
- Phase de déploiement
- Continu (supervision permanente)

## Quality Gates
- Couverture monitoring > 90%
- Alertes sans faux positifs

## RACI

| Activity | R | A | C | I |
|----------|---|---|---|
| Monitoring | **EXP-06** | CORE-07 | QA-04 | CORE-01 |
| Alerting | **EXP-06** | CORE-07 | QA-04 | CORE-01 |
| Runbooks | **EXP-06** | CORE-07 | — | CORE-01 |
| Définition SLO | **EXP-06** | CORE-01 | CORE-07 | — |
