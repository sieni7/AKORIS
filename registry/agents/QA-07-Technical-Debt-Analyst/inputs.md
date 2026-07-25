# Entrées — QA-07 Technical Debt Analyst

| Nom | Source | Format | Description | Obligatoire |
|-----|--------|--------|-------------|-------------|
| Code source | Dépôt GIT | Fichiers source | Code complet du module à analyser | Oui |
| Métriques SonarQube | CORE-01 / SonarQube | JSON / API | Dette technique, code smells, duplication | Oui |
| Métriques ESLint | CORE-01 | JSON / Fichier | Erreurs, warnings, règles violées | Oui |
| Historique des modifications | GIT | Logs / Réfs | Commits, PRs, refactoring récents | Non |
| Backlog existant | CORE-08 | JSON / Markdown | Tâches déjà identifiées de réduction de dette | Non |
| Rapports précédents | CORE-01 | Markdown / JSON | Historique dette technique pour tendance | Non |
