# Expected Deliverables — CORE-07 DevOps Engineer

## Format des livrables

| Livrable | Format | Contenu minimal | Destinataire |
|----------|--------|-----------------|--------------|
| Pipelines CI/CD | YAML / DSL | Étapes, déclencheurs, variables, secrets, notifications | Équipe DEV |
| Configurations d'infrastructure | Terraform / YAML | Ressources, modules, variables d'environnement, remote state | CORE-02 |
| Dashboards de monitoring | JSON / YAML | Métriques, alertes, seuils, logs, traces | Tous |
| Runbooks et procédures | Markdown (`.md`) | Procédures de déploiement, rollback, incident, escalade | CORE-01, support |
| Rapport d'état des environnements | Markdown (`.md`) | Statut, versions, incidents, capacité, coûts | CORE-01, CORE-02 |

## Règles de qualité
- Les pipelines doivent être versionnés dans le repository.
- Les configurations IaC doivent être revues par CORE-02.
- Les dashboards doivent couvrir au minimum : CPU, mémoire, latence, erreurs, requêtes.
- Chaque runbook doit inclure une procédure de rollback testée.
