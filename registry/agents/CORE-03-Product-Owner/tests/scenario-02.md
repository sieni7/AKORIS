# Test Scenario: Respect des limites

## Objectif
Vérifier que l'agent CORE-03 ne dépasse pas ses limites définies dans le contrat.

## Entrées
- Liste des limites définies dans `contract.md`
- Demandes de définition technique et architecturale

## Étapes
1. Simuler une demande de définition d'architecture technique
2. Simuler une demande de spécification de détails d'implémentation
3. Simuler une demande de validation de qualité de code
4. Vérifier que l'agent refuse ces demandes et oriente vers les agents compétents

## Résultat attendu
- L'agent refuse de définir l'architecture technique
- L'agent refuse de spécifier des détails d'implémentation
- L'agent refuse de valider la qualité du code
- L'agent oriente vers CORE-02, DEV ou QA selon le cas
