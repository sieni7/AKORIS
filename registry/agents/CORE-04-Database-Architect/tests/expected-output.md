# Expected Output — CORE-04 Database Architect

## Format des livrables

### Schéma de base de données
```yaml
database_schema:
  version: "1.0.0"
  database: "nom_base"
  engine: "PostgreSQL|MySQL|SQL Server|etc."
  entities:
    - name: "nom_entite"
      table: "nom_table"
      columns:
        - name: "nom_colonne"
          type: "VARCHAR|INTEGER|BOOLEAN|etc."
          constraints: ["NOT NULL", "PRIMARY KEY", "UNIQUE"]
          default: "valeur_par_defaut"
      relationships:
        - type: "one_to_many|many_to_many|one_to_one"
          to: "autre_entite"
          foreign_key: "nom_colonne_fk"
  indexes:
    - name: "idx_nom"
      columns: ["colonne1", "colonne2"]
      type: "BTREE|HASH|GIN|GiST"
```

### Script de migration
```yaml
migration:
  id: "MIG-XXX"
  version: "V1.0.XXX"
  description: "description du changement"
  up:
    - "ALTER TABLE ..."
    - "CREATE INDEX ..."
  down:
    - "DROP INDEX ..."
    - "ALTER TABLE ..."
  checksum: "sha256_hash"
```

### Plan d'indexation
```yaml
index_plan:
  table: "nom_table"
  queries:
    - pattern: "SELECT * FROM table WHERE condition"
      frequency: "high|medium|low"
      current_plan: "seq_scan|index_scan"
      recommended_index:
        columns: ["colonne"]
        type: "BTREE"
        estimated_improvement: "85%"
```

### Analyse de performance
```yaml
query_analysis:
  query_id: "Q-XXX"
  sql: "SELECT ..."
  execution_plan: "plan_text"
  current_duration_ms: 250
  target_duration_ms: 100
  recommendations:
    - type: "add_index|rewrite_query|partition"
      description: "recommandation"
      estimated_improvement: "60%"
```
