# Quality Gates — QA-04 Performance Auditor

| ID | Nom | Description | Sévérité | Seuil |
|----|-----|-------------|----------|-------|
| QG-PA-01 | Temps réponse moyen | Temps de réponse moyen sous le seuil défini | Bloquante | < 500 ms (selon module) |
| QG-PA-02 | Latence P99 | Latence au 99e percentile sous le seuil | Majeure | < 2000 ms |
| QG-PA-03 | Charge cible atteinte | La charge cible est atteinte sans dégradation | Bloquante | 100% charge cible |
| QG-PA-04 | Utilisation CPU | CPU sous la limite pendant le test de charge | Majeure | < 80% |
| QG-PA-05 | Utilisation mémoire | Mémoire sous la limite pendant le test | Majeure | < 85% |
| QG-PA-06 | Pas de régression | Pas de dégradation par rapport à la baseline | Majeure | < 5% d'écart |
| QG-PA-07 | Requêtes lentes | Pas de requête SQL > seuil | Mineure | < 1% des requêtes |
