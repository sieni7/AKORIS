# Quality Gates — CORE-07 DevOps Engineer

| ID | Nom | Description | Critères | Sévérité |
|----|-----|-------------|----------|----------|
| QG-CORE-07-01 | Pipeline vert | Le pipeline CI/CD doit passer avec succès avant tout déploiement | Build réussi, tests automatisés passés, analyse statique OK | Bloquant |
| QG-CORE-07-02 | Tests de charge validés | Tests de charge exécutés et validés par QA-04 | Seuils de performance respectés, aucun timeout ou erreur 5xx | Bloquant |
| QG-CORE-07-03 | Monitoring actif | Tous les services critiques sont monitorés | Métriques, logs et traces collectés, alertes configurées | Critique |
| QG-CORE-07-04 | Secrets sécurisés | Vérification de la gestion des secrets | Secrets dans un coffre, rotation configurée, pas de secret en clair | Bloquant |
| QG-CORE-07-05 | Procédure rollback testée | La procédure de retour arrière est documentée et testée | Rollback exécuté avec succès en environnement test | Critique |
