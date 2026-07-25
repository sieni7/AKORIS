# Quality Gates — CORE-05 Security Officer

| ID | Nom | Description | Critères | Sévérité |
|----|-----|-------------|----------|----------|
| QG-CORE-05-01 | Revue sécurité obligatoire | Revue formelle des livrables sécurité avant mise en production | Politique de sécurité approuvée, plan de test validé, analyse vulnérabilités réalisée | Bloquant |
| QG-CORE-05-02 | Conformité OWASP Top 10 | Vérification de la couverture des 10 risques OWASP | Chaque risque est identifié, évalué et traité ou accepté | Critique |
| QG-CORE-05-03 | AuthN/AuthZ validé | Validation du mécanisme d'authentification et de la matrice d'autorisation | Testé avec scénarios nominaux et dégradés | Bloquant |
| QG-CORE-05-04 | Chiffrement conforme | Vérification des règles de chiffrement données au repos et en transit | Algorithmes conformes, clés gérées, certificats valides | Critique |
| QG-CORE-05-05 | Journalisation sécurité active | Contrôle de la mise en place des logs de sécurité | Événements d'authentification et d'accès journalisés | Majeur |
