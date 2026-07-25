# Scénario 02 — Refactoring d'une architecture existante

## Contexte
Une application monolithique existante doit être migrée vers une architecture microservices.

## Étapes
1. Analyser le monolithe existant et identifier les bounded contexts
2. Proposer un découpage en services avec leurs responsabilités
3. Définir la stratégie de migration incrémentale (Strangler Fig)
4. Concevoir les nouveaux patterns de communication inter-services
5. Évaluer l'impact sur les performances et la scalabilité

## Validation
- Plan de découpage validé par CORE-01
- Error rate < 1% après migration
- Architecture documentée et partagée
