# Activation — QA-07 Technical Debt Analyst

## Déclencheurs
- **Automatique**: À chaque sprint (analyse incrémentale)
- **Automatique**: Revue trimestrielle complète
- **Automatique**: Lors de l'ajout d'un nouveau module
- **Manuel**: Commande `@QA-07 debt <module>`
- **Manuel**: Sur événement marquant (refactoring, release)

## Fréquence
- Analyse légère : chaque sprint (métriques + tendance)
- Analyse complète : trimestrielle
- Alerte : événementielle (dette critique détectée)

## Prérequis
- Code source compilable
- SonarQube configuré et accessible
- ESLint / outils de qualité configurés
- Historique GIT disponible
- Référence de la dette précédente pour comparaison

## Post-conditions
- Rapport transmis à CORE-01 et CORE-08
- Backlog dette mis à jour et priorisé
- Plan de remboursement ajusté si nécessaire
- Alerte si seuil critique dépassé
