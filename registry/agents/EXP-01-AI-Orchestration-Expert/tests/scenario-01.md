# Scenario 01: Optimisation de prompts multi-agents

**Objectif:** Optimiser les prompts pour un pipeline multi-agents de génération de composants.

## Préconditions
- Besoin métier : générer un formulaire d'inscription
- Agents impliqués : DEV-05 (UX), DEV-02 (Backend), QA-01 (Code Review)
- Contrainte : budget < $0.50 par session

## Déroulement
1. Activer EXP-01 avec `akoris activate EXP-01`
2. Analyser les prompts existants des agents
3. Concevoir la stratégie d'orchestration
4. Compresser et optimiser les prompts
5. Simuler les appels et mesurer les coûts

## Résultats attendus
- Prompts optimisés pour chaque agent
- Plan d'orchestration (séquence et dépendances)
- Estimation des tokens et coûts
- Recommandation de modèles

## Critères de succès
- Coût total < $0.50
- Token efficiency > 80%
- Tous les appels réussis en simulation
