# Livrables — QA-01 Code Reviewer

| Livrable | Format | Description | Fréquence | Destinataire |
|----------|--------|-------------|-----------|--------------|
| Rapport de revue | Markdown (.md) | Analyse complète du code avec anomalies et suggestions | Par PR/MR | DEV source, CORE-01, GOV-02 |
| Liste d'anomalies | JSON (.json) | Liste structurée des anomalies (fichier, ligne, sévérité) | Par PR/MR | CORE-01, QA-02 |
| Suggestions d'amélioration | Markdown (.md) | Recommandations pour améliorer la qualité du code | Par PR/MR | DEV source |
| Score de qualité | Nombre | Note de conformité sur 100 | Par PR/MR | GOV-02 |
| Validation de merge | Booléen | Approbation ou refus de la fusion | Par PR/MR | GIT, CORE-01 |
