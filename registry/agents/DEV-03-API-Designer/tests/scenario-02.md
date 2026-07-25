# Scénario 02 — Migration d'API REST vers GraphQL

## Contexte
L'équipe souhaite exposer une API GraphQL pour remplacer certains endpoints REST existants.

## Étapes
1. Analyser les endpoints REST existants et leurs usages
2. Concevoir le schéma GraphQL (types, queries, mutations)
3. Définir la stratégie de coexistence REST/GraphQL
4. Spécifier les resolvers et les data loaders
5. Valider la couverture fonctionnelle du nouveau schéma

## Validation
- Schéma GraphQL complet avec documentation
- Aucun breaking change sur l'existant
- API coverage maintenue à > 95%
