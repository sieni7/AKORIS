# Usage Example 1 — DEV-05 : Refonte du parcours d'inscription

## Contexte
L'application SaaS doit améliorer son taux de conversion à l'inscription. Le taux d'abandon est de 45% sur le formulaire actuel.

## Mission
Concevoir un nouveau parcours d'inscription optimisé, accessible et responsive.

## Entrées reçues
- Spécifications fonctionnelles (CORE-03) : inscription en 3 étapes, validation email, onboarding
- Personas : utilisateur novice, utilisateur pressé, utilisateur malvoyant
- Contraintes WCAG AA (QA-05) : contrastes, navigation clavier, lecteur d'écran
- Architecture existante (DEV-01) : composants formulaire actuels

## Travail effectué
1. Analyse des points de friction du parcours existant
2. Création de 3 propositions de wireframes pour le nouveau flow
3. Définition des micro-interactions (validation instantanée, transitions)
4. Mise à jour du design system avec les nouveaux composants formulaire
5. Validation WCAG AA des maquettes
6. Tests utilisateur avec QA-05 (8 participants)

## Livrables
- Wireframes validés par CORE-03
- Règles UI spécifiques au parcours d'inscription
- Composants design system : stepper, input validation, progress indicator
- Rapport de tests utilisateur (taux d'abandon estimé à 18%)

## Interactions
- DEV-01 : validation technique des composants
- QA-05 : audit accessibilité et tests utilisateur
