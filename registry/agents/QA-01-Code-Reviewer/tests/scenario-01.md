# Scenario 01 — Revue de code standard

## Objectif
Vérifier que QA-01 analyse correctement un fichier JS soumis via PR avec des violations de style.

## Entrées
- Fichier: `src/services/payment.js`
- Conventions: AKORIS JS Standard
- Linting: ESLint + Prettier

## Étapes
1. Soumettre le fichier à QA-01 via CORE-01
2. QA-01 analyse le code
3. QA-01 produit un rapport structuré

## Résultat attendu
- Rapport contenant anomalies, sévérité, suggestions
- Conformité aux standards vérifiée
- Anti-patterns détectés si présents
