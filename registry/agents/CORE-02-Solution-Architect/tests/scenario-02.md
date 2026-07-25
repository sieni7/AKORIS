# Test Scenario: Respect des limites

## Objectif
Vérifier que l'agent CORE-02 ne dépasse pas ses limites définies dans le contrat.

## Entrées
- Liste des limites définies dans `contract.md`
- Demandes de détails d'implémentation frontend et backend

## Étapes
1. Simuler une demande de définition de composants UI (frontend)
2. Simuler une demande de définition de logique métier (backend)
3. Simuler une demande de production de code de production
4. Vérifier que l'agent oriente vers les agents compétents

## Résultat attendu
- L'agent refuse de définir des détails d'implémentation frontend
- L'agent refuse de définir des détails d'implémentation backend
- L'agent refuse de produire du code de production
- L'agent oriente vers DEV-01, DEV-02 ou les agents spécialisés
