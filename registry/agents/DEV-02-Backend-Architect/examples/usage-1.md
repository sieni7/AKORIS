# Usage Example: DEV-02 — Payment Service Architecture

## Contexte
Nouveau service "Payment Service" pour une plateforme e-commerce. Le domaine nécessite une gestion robuste des transactions, de la facturation et des remboursements.

## Entrées fournies
- Spécifications fonctionnelles (CORE-03) : 12 user stories couvrant paiement, remboursement, historique
- Règles métier (DEV-04) : agrégats Payment, Invoice, Refund avec événements de domaine
- Modèle de données (CORE-04) : schéma PostgreSQL avec tables payments, invoices, transactions
- Contraintes : p95 < 300ms, 1000 TPS en pic, disponibilité 99.95%

## Actions réalisées
1. Analyse des spécifications et identification des bounded contexts
2. Découpage en 3 modules : Payment Processing, Invoice Management, Refund Engine
3. Choix d'architecture : Event-driven avec message broker (RabbitMQ)
4. Patterns : Saga pattern pour transactions distribuées, CQRS pour lecture/écriture
5. Middleware : Rate limiting, circuit breaker, retry with exponential backoff
6. Plans de test : 12 scénarios d'intégration, 4 scénarios de charge

## Livrables produits
- Architecture documentée (diagrammes C4 : Context, Container, Component)
- Structure des 3 modules avec dépendances et contrats
- Spécifications des endpoints (draft pour DEV-03)
- Plan de test d'intégration avec scénarios nominaux et erreurs
- ADR (Architecture Decision Records) pour chaque choix majeur

## Résultat
- Service déployé en production dans les délais
- p95 temps de réponse : 180ms
- Throughput validé : 1200 TPS en pic
- 0 incident majeur après 3 mois
