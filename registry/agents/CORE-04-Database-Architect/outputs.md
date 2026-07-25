# Livrables attendus – Database Architect (CORE-04)

| Nom | Format | Description | Fréquence | Consommateur |
|-----|--------|-------------|-----------|--------------|
| Schéma de base de données | SQL / Markdown | Modèle logique et physique complet | Phase de conception + évolutions | CORE-02, DEV-02 |
| Scripts de migration | SQL | Scripts versionnés (up/down) pour chaque évolution du schéma | À chaque changement de schéma | DEV-02, CORE-07 (DevOps) |
| Plan d'indexation | Markdown | Stratégie d'indexation avec justification par table | Phase de conception + trimestriel | DEV-02, QA-04 |
| Analyse de performance SQL | Markdown | Plan d'exécution, temps mesurés, recommandations | Par requête critique | QA-04, DEV-02 |
| Dictionnaire des données | Markdown / JSON | Description de chaque table, colonne, type et contrainte | Continu | Tous les agents |
| Rapport de revue de schéma | Markdown | Résultat de la revue : conformité, anomalies, recommandations | À chaque nouveau schéma | CORE-02, CORE-01 |
