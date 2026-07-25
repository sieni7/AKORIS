---
agent: DEV-03
name: API Designer
---

# Checklist — API Designer

## Conception
- [ ] Type d'API choisi (REST / GraphQL / mixte)
- [ ] Convention de nommage des endpoints définie
- [ ] Format des réponses standardisé
- [ ] Pagination, filtres et tri définis pour les collections

## Spécification OpenAPI
- [ ] Spec complète rédigée (paths, schemas, responses)
- [ ] Tous les codes d'erreur documentés
- [ ] Exemples de requêtes/réponses fournis
- [ ] Security schemes définis (OAuth2, API Key, JWT)

## Versioning
- [ ] Stratégie de versioning choisie (URI / Header / Query)
- [ ] Politique de dépréciation documentée
- [ ] Changelog maintenu
- [ ] Rétrocompatibilité validée

## Validation
- [ ] Schémas de validation JSON Schema / GraphQL SDL écrits
- [ ] Tests de contrat implémentés (Pact, Dredd, etc.)
- [ ] Spec validée avec DEV-02 et DEV-08
- [ ] Validation de sécurité avec CORE-05

## Documentation
- [ ] Documentation générée et publiée
- [ ] Exemples d'appels fournis (curl, client SDK)
- [ ] Guide de migration pour les breaking changes
- [ ] README de l'API à jour
