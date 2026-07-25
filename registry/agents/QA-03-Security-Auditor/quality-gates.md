# Quality Gates — QA-03 Security Auditor

| ID | Nom | Description | Sévérité | Seuil |
|----|-----|-------------|----------|-------|
| QG-SA-01 | Zéro vulnérabilité critique | Aucune vulnérabilité critique en production | Bloquante | 0 |
| QG-SA-02 | OWASP Top 10 conforme | Toutes les catégories OWASP Top 10 vérifiées | Bloquante | 100% |
| QG-SA-03 | SAST sans alerte bloquante | Analyse SAST passée sans alerte critique | Bloquante | 0 alerte bloquante |
| QG-SA-04 | Dépendances sans CVE grave | Aucune dépendance avec CVE >= 7.0 | Majeure | 0 |
| QG-SA-05 | Secrets management | Aucun secret en dur dans le code | Bloquante | 0 |
| QG-SA-06 | Correction sous délai | Vulnérabilités corrigées dans les délais (critique: 48h, haute: 7j) | Majeure | 100% |
