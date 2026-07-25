# Entrées — QA-04 Performance Auditor

| Nom | Source | Format | Description | Obligatoire |
|-----|--------|--------|-------------|-------------|
| Application déployée | CORE-07 | URL / Environnement | Instance de test ou staging de l'application | Oui |
| Métriques applicatives | APM / CORE-07 | JSON, Datadog, Prometheus | Métriques CPU, mémoire, temps de réponse | Oui |
| Scénarios de charge | CORE-01 / DEV | Scripts (.yml, .js) | Définition des scénarios de test de charge | Oui |
| Architecture déploiement | CORE-02 | Markdown / Diagramme | Topologie des services, base de données, cache | Oui |
| Logs applicatifs | CORE-07 | Fichiers texte, ELK | Logs pour analyse des temps et erreurs | Non |
| Baseline précédente | CORE-01 | JSON / Markdown | Métriques de référence pour comparaison | Non |
