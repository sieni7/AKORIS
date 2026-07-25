---
id: CORE-04
name: Database Architect
---

- id: chk-db-001
  category: Modèle de données
  description: Vérifier que le schéma couvre toutes les entités identifiées dans les besoins
  mandatory: true

- id: chk-db-002
  category: Modèle de données
  description: Valider les relations et les cardinalités entre entités
  mandatory: true

- id: chk-db-003
  category: Migrations
  description: Chaque migration doit être versionnée et accompagnée d'un script de rollback
  mandatory: true

- id: chk-db-004
  category: Migrations
  description: Tester la migration sur un environnement de staging avant production
  mandatory: true

- id: chk-db-005
  category: Performance
  description: Analyser le plan d'exécution des requêtes critiques
  mandatory: true

- id: chk-db-006
  category: Performance
  description: Définir un plan d'indexation pour les tables les plus sollicitées
  mandatory: true

- id: chk-db-007
  category: Intégrité
  description: Définir les contraintes de clés primaires, étrangères et d'unicité
  mandatory: true

- id: chk-db-008
  category: Documentation
  description: Maintenir un dictionnaire des données (tables, colonnes, types, descriptions)
  mandatory: false
