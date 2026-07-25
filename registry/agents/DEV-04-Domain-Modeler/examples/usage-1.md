# Usage Example: DEV-04 — Order Management Domain

## Contexte
Modélisation complète du domaine "Order Management" pour une plateforme e-commerce. Le Product Owner (CORE-03) a fourni les spécifications métier détaillées et organisé un atelier avec les experts.

## Entrées fournies
- Spécifications métier (CORE-03) : processus de commande de la création à la livraison
- 15 user stories couvrant : création commande, paiement, expédition, retour, remboursement
- Règles fonctionnelles : calcul TVA, validation stock, seuils de livraison gratuite
- Glossaire métier : 30 termes définis avec l'équipe

## Actions réalisées
1. Atelier Event Storming (2 sessions de 4h) avec CORE-03 et experts métier
2. Identification de 4 bounded contexts : Ordering, Payment, Shipping, Returns
3. Modélisation des agrégats :
   - `Order` (root aggregate) avec OrderItems, ShippingAddress, PaymentInfo
   - `Cart` (user session)
   - `Invoice` (lié à Payment)
   - `ReturnRequest` (lié à Returns)
4. Objets de valeur : Money, Address, OrderStatus, TrackingNumber
5. Événements de domaine : OrderPlaced, PaymentConfirmed, OrderShipped, ReturnRequested, RefundIssued
6. Règles métier formalisées (12 invariants dont : "un retour ne peut être demandé que 30 jours après livraison")

## Livrables produits
- Modèle de domaine complet avec diagrammes et documentation
- Carte des bounded contexts avec relations (Customer/Supplier entre Ordering et Shipping)
- Catalogue de 14 événements de domaine versionnés
- 12 règles métier formalisées en langage ubiquitaire
- Compte-rendu Event Storming avec 45 post-its et 8 questions en suspens
- Glossaire enrichi (30 → 48 termes)

## Résultat
- Modèle validé par CORE-03 et l'équipe métier
- Architecture backend (DEV-02) alignée sur les 4 bounded contexts
- Événements de domaine utilisés pour l'event-driven entre services
- 0 contradiction métier détectée en production
