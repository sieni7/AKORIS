# Usage Example: DEV-03 — Customer Management API

## Contexte
Conception d'une API REST de gestion des clients pour une plateforme SaaS B2B. L'architecture backend (DEV-02) a défini un service dédié "Customer Service" avec des contraintes de sécurité strictes.

## Entrées fournies
- Architecture backend (DEV-02) : Customer Service, bounded context clients
- Modèle de domaine (DEV-04) : agrégats Customer, Address, Contact avec règles métier
- Contraintes sécurité (CORE-05) : OAuth2, rôles (admin, manager, viewer)
- Spécifications fonctionnelles (CORE-03) : CRUD clients, recherche, export

## Actions réalisées
1. Design des endpoints RESTful :
   - `GET /api/v1/customers` — liste paginée avec filtres
   - `POST /api/v1/customers` — création
   - `GET /api/v1/customers/{id}` — détail
   - `PUT /api/v1/customers/{id}` — mise à jour
   - `DELETE /api/v1/customers/{id}` — suppression (soft delete)
   - `GET /api/v1/customers/export` — export CSV
2. Spécification OpenAPI 3.1 complète (18 paths, 25 schemas)
3. Versioning via URI path (`/api/v1/...`)
4. Politique de dépréciation : 2 versions supportées, 6 mois de transition
5. Tests de contrat avec Pact (provider + consumer)

## Livrables produits
- Spec OpenAPI 3.1 (customer-api.yaml) validée par DEV-02
- Tests de contrat Pact (12 interactions provider, 8 consumer)
- Documentation publiée sur Swagger Hub
- Guide de migration v1 → v2

## Résultat
- API livrée et consommée par 3 services frontend
- Tests de contrat passent en CI à chaque déploiement
- 0 régression API après 6 mois en production
