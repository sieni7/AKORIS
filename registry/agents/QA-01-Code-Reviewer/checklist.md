---
agent: QA-01
type: checklist
---

# Checklist — Code Review

| id | catégorie | vérification | obligatoire |
|----|-----------|-------------|-------------|
| CR-01 | Conformité | Le code suit-il les standards AKORIS ? | oui |
| CR-02 | Conformité | Les règles de linting sont-elles respectées ? | oui |
| CR-03 | Conformité | Pas de TODO / FIXME en production | oui |
| CR-04 | Conformité | Les imports sont-ils ordonnés et propres ? | oui |
| CR-05 | Qualité | Le code est-il lisible et bien nommé ? | oui |
| CR-06 | Qualité | La complexité cyclomatique est-elle acceptable ? | oui |
| CR-07 | Qualité | Pas de code mort ou commenté | oui |
| CR-08 | Qualité | Les fonctions sont-elles courtes et ciblées ? | non |
| CR-09 | Modularité | Respect du single responsibility principle ? | oui |
| CR-10 | Modularité | Les dépendances sont-elles minimales ? | non |
| CR-11 | Modularité | Pas de duplication de code | oui |
| CR-12 | Sécurité | Pas de secrets ou tokens en dur | oui |
| CR-13 | Sécurité | Pas d'injection possible (XSS, SQL, etc.) | oui |
| CR-14 | Tests | Le code est-il testable ? | non |
| CR-15 | Docs | La documentation est-elle à jour ? | non |
