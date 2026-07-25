# Quality Gates — DEV-08

| Gate | Description | Seuil | Vérifié par |
|------|-------------|-------|-------------|
| QG-08-01 | Tests d'intégration automatisés | 100% des connecteurs couverts | QA-02 |
| QG-08-02 | Fallback testé | Chaque intégration a un fallback validé | QA-02 |
| QG-08-03 | Sécurité des credentials | Aucun secret dans le code | QA-03 |
| QG-08-04 | Documentation complète | Auth, endpoints, erreurs, rate limits documentés | DEV-03 |
| QG-08-05 | Résilience | Circuit breaker et retry implémentés | DEV-02 |
