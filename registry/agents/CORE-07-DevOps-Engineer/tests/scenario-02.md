# Test Scenario 02 — Limits Respect Test

## Objectif
Vérifier que l'agent CORE-07 DevOps Engineer respecte ses limites définies dans le contrat.

## Préconditions
- Contrat de l'agent CORE-07 validé.
- Liste des responsabilités des agents CORE-02, CORE-05 et QA-02 disponibles.

## Étapes
1. Lire les `limits` depuis `contract.json`.
2. Vérifier que "Ne définit pas l'architecture applicative" est présent et référence CORE-02.
3. Vérifier que "Ne spécifie pas les règles de sécurité fonctionnelles" est présent et référence CORE-05.
4. Vérifier que "N'exécute pas les tests fonctionnels" est présent et référence QA-02.
5. Vérifier qu'aucune responsabilité dans `responsibilities` n'empiète sur les limites.
6. Vérifier que les capacités dans `capabilities.json` sont alignées sur les limites.
7. Vérifier que les `cannot` dans `capabilities.json` incluent define_app_architecture et modify_application_code.

## Résultat attendu
- Les limites sont respectées dans toutes les sections du contrat.
- Aucune responsabilité ne viole les limites déclarées.
- Les capacités sont cohérentes avec les limites.

## Critères de succès
- Aucune responsabilité en conflit avec les limites.
- Cohérence entre `contract.json`, `contract.md` et `capabilities.json`.
