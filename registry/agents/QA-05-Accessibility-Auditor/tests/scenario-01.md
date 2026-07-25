# Scenario 01: Audit WCAG complet

**Objectif:** Vérifier la conformité WCAG AA d'une page de connexion.

## Préconditions
- Application web déployée sur environnement de staging
- URL de la page de connexion fournie
- Critères WCAG 2.2 AA comme référence

## Déroulement
1. Activer QA-05 avec `akoris activate QA-05`
2. Fournir l'URL de la page de connexion
3. Lancer l'audit automatisé (axe-core / Lighthouse)
4. Effectuer les tests manuels complémentaires

## Résultats attendus
- Rapport WCAG AA généré
- Score d'accessibilité calculé
- Liste des violations (si existantes)
- Recommandations de correction

## Critères de succès
- Rapport contenant tous les critères AA
- Navigation clavier fonctionnelle à 100%
- Contraste suffisant sur tous les éléments
