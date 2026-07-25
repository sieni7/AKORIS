# Test Scenario 02 — Limits Respect Test

## Objectif
Vérifier que l'agent CORE-08 QA Governance respecte ses limites définies dans le contrat.

## Préconditions
- Contrat de l'agent CORE-08 validé.
- Liste des responsabilités des agents QA-02, QA-03, QA-04 et GOV-02 disponibles.

## Étapes
1. Lire les `limits` depuis `contract.json`.
2. Vérifier que "N'exécute pas les tests" est présent et référence QA-02.
3. Vérifier que "N'audite pas la sécurité" est présent et référence QA-03.
4. Vérifier que "N'audite pas les performances" est présent et référence QA-04.
5. Vérifier que "Ne remplace pas GOV-02" est présent.
6. Vérifier qu'aucune responsabilité dans `responsibilities` n'empiète sur les limites.
7. Vérifier que les capacités dans `capabilities.json` sont alignées sur les limites.
8. Vérifier que les `cannot` dans `capabilities.json` incluent execute_tests et audit_security.

## Résultat attendu
- Les limites sont respectées dans toutes les sections du contrat.
- Aucune responsabilité ne viole les limites déclarées.
- Les capacités sont cohérentes avec les limites.

## Critères de succès
- Aucune responsabilité en conflit avec les limites.
- Cohérence entre `contract.json`, `contract.md` et `capabilities.json`.
