# Scenario 02 — Mise à jour d'un template

## Contexte

Un retour d'expérience de GOV-03 indique que le template `microservice` manque la configuration de health checks.

## Entrées

- Template concerné: `microservice-nodejs`
- Retour: ajouter health check endpoint + probe Kubernetes
- Priorité: haute

## Déroulement attendu

1. EXP-07 analyse le retour d'expérience
2. Modèle le template avec l'ajout du health check
3. Met à jour l'outil de scaffolding
4. Teste la reproductibilité sur un projet pilote
5. Publie la nouvelle version du template
6. Notifie GOV-01 et CORE-01

## Critères de succès

- Mise à jour livrée en < 1 jour
- Template testé sur au moins 1 projet pilote
- Documentation du template mise à jour
