---
agent: QA-03
type: checklist
---

# Checklist — Security Audit

| id | catégorie | vérification | obligatoire |
|----|-----------|-------------|-------------|
| SA-01 | OWASP | Protection XSS vérifiée ? | oui |
| SA-02 | OWASP | Protection CSRF en place ? | oui |
| SA-03 | OWASP | Pas d'injection SQL possible ? | oui |
| SA-04 | OWASP | Authentification sécurisée (MFA si requis) ? | oui |
| SA-05 | OWASP | Gestion de sessions conforme ? | oui |
| SA-06 | OWASP | Contrôle d'accès vérifié (RBAC) ? | oui |
| SA-07 | Dépendances | Aucune dépendance avec CVE connue ? | oui |
| SA-08 | Dépendances | Versions des dépendances à jour ? | non |
| SA-09 | Infrastructure | Pas de ports exposés inutiles ? | oui |
| SA-10 | Infrastructure | Chiffrement en transit (TLS) ? | oui |
| SA-11 | Infrastructure | Chiffrement au repos configuré ? | oui |
| SA-12 | Secrets | Aucun secret en dur dans le code ? | oui |
| SA-13 | Secrets | Gestion des secrets via vault/tooling ? | oui |
| SA-14 | Logs | Pas de données sensibles dans les logs ? | oui |
| SA-15 | SAST | Analyse SAST passée sans alerte bloquante ? | oui |
