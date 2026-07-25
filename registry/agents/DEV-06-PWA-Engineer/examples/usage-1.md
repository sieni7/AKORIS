# Usage Example 1 — DEV-06 : Mise en place PWA pour application e-commerce

## Contexte
Application e-commerce avec fort trafic mobile. Les utilisateurs en zone à connectivité réduite perdent des ventes. Objectif : transformer en PWA avec mode offline partiel.

## Mission
Implémenter une stratégie PWA complète : service worker, cache intelligent, mode offline pour les pages catalogue, notifications push de suivi de commande.

## Entrées reçues
- Spécifications PWA (CORE-01) : support offline catalogue + notifications commandes
- Architecture frontend (DEV-01) : React SPA avec routage client
- Besoins offline (CORE-03) : consultation catalogue, statut commande
- Recommandations cache (DEV-07) : stratégies pour images, API, assets

## Travail effectué
1. Création du service worker avec stratégies différenciées :
   - Cache First pour les assets statiques
   - Network First pour les données API
   - Stale-While-Revalidate pour les images
2. Configuration du manifest.json (icônes, thème, display standalone)
3. Implémentation du fallback offline pour le catalogue
4. Mise en place des notifications push via Web Push API
5. Tests offline sur les parcours identifiés

## Livrables
- Service worker avec stratégies de cache documentées
- Manifest.json configuré
- Plan de test offline transmis à QA-04
- Documentation technique des notifications push

## Résultats
- Lighthouse PWA score : 96
- 100% des parcours catalogue disponibles offline
- Notifications push fonctionnelles avec gestion des permissions

## Interactions
- DEV-01 : validation de l'intégration SW dans le build
- DEV-07 : optimisation des stratégies de cache
