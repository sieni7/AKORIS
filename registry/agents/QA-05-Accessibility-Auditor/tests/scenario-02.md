# Scenario 02: Test navigation clavier et lecteurs d'écran

**Objectif:** Valider la navigation au clavier et la compatibilité avec les lecteurs d'écran.

## Préconditions
- Application web avec formulaire multi-étapes
- Lecteur d'écran NVDA ou VoiceOver disponible
- Page de tableau de bord complexe

## Déroulement
1. Activer QA-05
2. Parcourir l'application complète au clavier (Tab, Shift+Tab, Enter, Escape)
3. Tester avec lecteur d'écran actif
4. Vérifier les annonces ARIA et les rôles
5. Documenter les anomalies

## Résultats attendus
- Rapport de navigation clavier
- Rapport compatibilité lecteurs d'écran
- Liste des problèmes ARIA
- Score de navigation

## Critères de succès
- 100% des éléments accessibles au clavier
- Indicateur de focus visible sur tous les éléments
- Annonces ARIA correctes et complètes
