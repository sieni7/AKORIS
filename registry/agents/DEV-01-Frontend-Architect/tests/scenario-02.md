# Scénario 02 — Optimisation des performances UI

## Contexte
L'application existante souffre de problèmes de performance (LCP > 4s, CLS > 0.25). Une optimisation est nécessaire.

## Étapes
1. Auditer les performances actuelles avec Lighthouse
2. Identifier les composants lents et les goulets d'étranglement
3. Proposer des optimisations (code splitting, memo, virtualisation)
4. Implémenter les correctifs de performance
5. Vérifier l'impact des optimisations

## Validation
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
- Bundle size réduit de 30%
