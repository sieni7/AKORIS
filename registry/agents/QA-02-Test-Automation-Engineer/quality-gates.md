# Quality Gates — QA-02 Test Automation Engineer

| ID | Nom | Description | Sévérité | Seuil |
|----|-----|-------------|----------|-------|
| QG-TA-01 | Couverture minimale | Couverture de code globale > 80% | Bloquante | > 80% |
| QG-TA-02 | Tests E2E critiques | Parcours critiques couverts par E2E | Bloquante | 100% des parcours critiques |
| QG-TA-03 | Zéro test flaky | Aucun test flaky toléré en release | Majeure | 0 |
| QG-TA-04 | Tests unitaires présents | Chaque module a des tests unitaires | Bloquante | 100% des modules |
| QG-TA-05 | Exécution CI | Tous les tests passent en CI | Bloquante | 100% succès |
| QG-TA-06 | Temps d'exécution | Suite de tests sous le seuil défini | Mineure | < 10 min |
| QG-TA-07 | Indépendance des tests | Pas de dépendance d'état entre tests | Majeure | 0 dépendance |
