# Activation — QA-06 Documentation Auditor

## Déclencheurs
- **Automatique**: Avant chaque release en production
- **Automatique**: À la fin de chaque sprint (vérification sprints)
- **Manuel**: Commande `@QA-06 docs-audit <module>`
- **Manuel**: Sur demande de CORE-06

## Fréquence
- Audit complet : avant chaque release
- Audit rapide : en fin de sprint
- Inventaire complet : trimestriel

## Prérequis
- Documentation du module disponible dans le dépôt
- Template de documentation AKORIS défini
- Style guide AKORIS accessible
- Liste des modules et de leur périmètre à jour

## Post-conditions
- Rapport d'audit transmis à CORE-01 et CORE-06
- Lacunes documentées remontées aux agents DEV concernés
- Score de complétude enregistré dans le registre de qualité
