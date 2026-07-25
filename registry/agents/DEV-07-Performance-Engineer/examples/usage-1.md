# Usage Example 1 — DEV-07 : Optimisation des performances d'un dashboard analytics

## Contexte
Dashboard analytics temps réel avec chargement lent (LCP à 4.2s), ressenti comme "lourd" par les utilisateurs. Objectif : passer sous les seuils Core Web Vitals.

## Mission
Analyser les goulots d'étranglement, optimiser le chargement et le rendu du dashboard, réduire la taille du bundle.

## Entrées reçues
- Architecture applicative (DEV-01) : React, Recharts, WebSocket, routes dynamiques
- Métriques actuelles (QA-04) : LCP 4.2s, FID 180ms, CLS 0.15, bundle 1.8MB
- Seuils clients (CORE-03) : LCP < 2s, FID < 100ms, CLS < 0.1
- Stratégie cache existante (DEV-06) : SW avec Cache First sur assets

## Travail effectué
1. Analyse du bundle avec webpack-bundle-analyzer
2. Code splitting par route et par composant lourd (charts)
3. Lazy loading des visualisations non visibles
4. Optimisation des dépendances (lodash tree-shaking, moment → date-fns)
5. Mise en place du préchargement des données critiques
6. Optimisation des images et polices

## Résultats
- LCP : 4.2s → 1.8s
- FID : 180ms → 45ms
- CLS : 0.15 → 0.05
- Bundle size : 1.8MB → 620KB
- Cache hit ratio : 92%

## Livrables
- Performance budget documenté
- Rapport d'optimisation avec comparaison avant/après
- Configuration CDN et cache mise à jour
- Recommandations pour les sprints suivants

## Interactions
- DEV-01 : implémentation du code splitting
- QA-04 : validation des nouvelles métriques
