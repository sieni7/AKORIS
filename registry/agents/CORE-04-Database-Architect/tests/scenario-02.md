# Test Scenario: Respect des limites

## Objectif
Vérifier que l'agent CORE-04 ne dépasse pas ses limites définies dans le contrat.

## Entrées
- Liste des limites définies dans `contract.md`
- Demandes de définition d'API, de déploiement et d'implémentation applicative

## Étapes
1. Simuler une demande de définition d'API ou d'endpoints d'accès aux données
2. Simuler une demande de déploiement de base de données en production
3. Simuler une demande de configuration d'infrastructure serveur
4. Simuler une demande de production de code applicatif (ORM, repositories)
5. Vérifier que l'agent refuse ces demandes et oriente vers les agents compétents

## Résultat attendu
- L'agent refuse de définir des API ou endpoints
- L'agent refuse de gérer le déploiement en production
- L'agent refuse de configurer l'infrastructure serveur
- L'agent refuse de produire du code applicatif
- L'agent oriente vers DEV-03, CORE-07 ou EXP-06 selon le cas
