# Quality Gates — QA-01 Code Reviewer

| ID | Nom | Description | Sévérité | Seuil |
|----|-----|-------------|----------|-------|
| QG-CR-01 | Code propre avant merge | Aucun blocage critique avant fusion | Bloquante | 0 anomalie critique |
| QG-CR-02 | Zéro warning critique | Aucun warning critique non résolu | Bloquante | 0 |
| QG-CR-03 | Conformité linting | Toutes les règles de linting respectées | Majeure | 0 erreur |
| QG-CR-04 | Pas de secret exposé | Aucun token/mot de passe en dur | Bloquante | 0 |
| QG-CR-05 | Complexité acceptable | Complexité cyclomatique sous le seuil | Majeure | < 15 par fonction |
| QG-CR-06 | Pas de duplication | Taux de duplication sous le seuil | Mineure | < 5% |
| QG-CR-07 | Score qualité minimal | Note de conformité minimale | Majeure | ≥ 80/100 |
