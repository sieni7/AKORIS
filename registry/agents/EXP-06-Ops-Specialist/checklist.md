# Checklist — EXP-06 Ops Specialist

## Monitoring
- [ ] Métriques applicatives collectées (CPU, mémoire, latence, throughput)
- [ ] Uptime monitor configuré
- [ ] Health checks API en place
- [ ] Synthetic monitoring déployé

## Alerting
- [ ] Règles d'alerting définies par sévérité
- [ ] Seuils validés avec l'équipe métier
- [ ] Escalation matrix documentée
- [ ] Canaux de notification configurés (email, slack, pager)

## Logging & Tracing
- [ ] Logs structurés (JSON) pour toutes les applications
- [ ] Centralisation des logs (ELK / Loki)
- [ ] Distributed tracing actif
- [ ] Rétention des logs conforme à la politique

## Runbooks
- [ ] Runbook pour chaque type d'incident connu
- [ ] Procédure d'escalade documentée
- [ ] Runbooks testés lors d'exercices

## SLO / SLI / SLA
- [ ] SLI définis pour chaque service critique
- [ ] SLO calculés et dashboard associé
- [ ] Burn rate alerts configurées
