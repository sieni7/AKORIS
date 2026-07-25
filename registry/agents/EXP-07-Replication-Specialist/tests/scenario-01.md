# Scenario 01 — Création d'un nouveau projet

## Contexte

L'équipe démarre un nouveau projet microservice. L'Orchestrator (CORE-01) sollicite EXP-07 pour initialiser le projet.

## Entrées

- Type de projet: microservice Node.js / TypeScript
- Stack: Express, Prisma, PostgreSQL
- CI/CD: GitHub Actions

## Déroulement attendu

1. EXP-07 sélectionne le template adapté
2. Exécute l'outil de scaffolding
3. Génère la structure complète du projet (dossiers, configs, CI/CD)
4. Valide la reproductibilité
5. Documente les écarts éventuels
6. Livre le projet scaffoldé à CORE-01

## Critères de succès

- Projet prêt en < 30 min (vs 60 min manuel)
- Structure conforme au standard AKORIS
- Pipeline CI/CD fonctionnel
