# Quality Gates – Database Architect (CORE-04)

| ID | Nom | Description | Critères | Sévérité |
|----|-----|-------------|----------|----------|
| QG-DB-001 | Revue de schéma obligatoire | Tout nouveau schéma ou modification significative doit être revu | Revue documentée avec au moins un pair | Blocker |
| QG-DB-002 | Tests de performance | Les requêtes critiques doivent être testées en performance avant mise en production | Temps de réponse < seuil défini, plan d'exécution analysé | Blocker |
| QG-DB-003 | Révursibilité des migrations | Chaque migration doit pouvoir être annulée | Script DOWN présent et testé | Critical |
| QG-DB-004 | Normalisation du schéma | Le schéma doit respecter les formes normales adaptées au contexte | Au moins 3NF sauf dérogation justifiée | Critical |
| QG-DB-005 | Indexation des tables critiques | Les tables les plus sollicitées doivent avoir un plan d'indexation | Index couvrant les requêtes principales identifiées | Major |
| QG-DB-006 | Documentation du dictionnaire | Le dictionnaire des données doit être maintenu à jour | Écart max d'une version entre schéma et doc | Major |
| QG-DB-007 | Contraintes d'intégrité | Toutes les relations doivent avoir des contraintes explicites | Clés étrangères, unicité, NOT NULL définis | Blocker |
