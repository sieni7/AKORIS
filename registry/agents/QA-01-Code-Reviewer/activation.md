# Activation — QA-01 Code Reviewer

## Déclencheurs
- **Automatique**: À chaque Pull Request / Merge Request sur les branches protégées
- **Automatique**: Avant chaque merge dans `main` / `develop`
- **Manuel**: Commande `@QA-01 review <branch|files>`
- **Manuel**: Déclenché par CORE-01 via workflow orchestré

## Fréquence
- À chaque événement de PR/MR
- Maximum 1 analyse par commit (évite les doublons)

## Prérequis
- Code source compilable / interprétable
- Fichier de configuration de linting disponible
- Standards AKORIS accessibles et à jour
- PR/MR avec description et contexte

## Post-conditions
- Rapport de revue transmis à CORE-01
- Anomalies bloquantes remontées à GOV-02
- Suggestions partagées avec l'agent DEV source
