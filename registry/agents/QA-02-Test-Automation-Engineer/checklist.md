---
agent: QA-02
type: checklist
---

# Checklist — Test Automation

| id | catégorie | vérification | obligatoire |
|----|-----------|-------------|-------------|
| TA-01 | Stratégie | Un plan de test a-t-il été rédigé ? | oui |
| TA-02 | Stratégie | Les types de test sont-ils définis (unitaire, intégration, E2E) ? | oui |
| TA-03 | Stratégie | Les critères d'acceptation sont-ils couverts ? | oui |
| TA-04 | Unitaires | Chaque fonction/méthode a-t-elle un test ? | oui |
| TA-05 | Unitaires | Les cas limites sont-ils testés ? | oui |
| TA-06 | Unitaires | Les mocks sont-ils appropriés ? | non |
| TA-07 | Intégration | Les API contracts sont-ils testés ? | oui |
| TA-08 | Intégration | Les flux inter-services sont-ils couverts ? | oui |
| TA-09 | E2E | Les parcours critiques sont-ils automatisés ? | oui |
| TA-10 | E2E | Les tests sont-ils reproductibles ? | oui |
| TA-11 | Couverture | La couverture est-elle > 80% ? | oui |
| TA-12 | Couverture | Les nouvelles lignes sont-elles couvertes à 90%+ ? | non |
| TA-13 | Qualité | Les tests sont-ils indépendants ? | oui |
| TA-14 | Qualité | Pas de tests flaky identifiés ? | oui |
| TA-15 | CI | Les tests s'exécutent-ils en CI avec succès ? | oui |
