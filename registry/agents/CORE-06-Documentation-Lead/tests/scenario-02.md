# Test Scenario 02 — Limits Respect Test

## Objectif
Vérifier que l'agent CORE-06 Documentation Lead respecte ses limites définies dans le contrat.

## Préconditions
- Contrat de l'agent CORE-06 validé.
- Liste des responsabilités de CORE-03 disponible.

## Étapes
1. Lire les `limits` depuis `contract.json`.
2. Vérifier que "Ne rédige pas la documentation technique détaillée des composants" est présent.
3. Vérifier que "Ne se substitue pas aux experts métier" est présent.
4. Vérifier que "Ne valide pas le contenu fonctionnel" est présent et référence CORE-03.
5. Vérifier qu'aucune responsabilité dans `responsibilities` n'empiète sur les limites.
6. Vérifier que les capacités dans `capabilities.json` sont alignées sur les limites.
7. Vérifier que les `cannot` dans `capabilities.json` incluent write_technical_doc_for_components et modify_code.

## Résultat attendu
- Les limites sont respectées dans toutes les sections du contrat.
- Aucune responsabilité ne viole les limites déclarées.
- Les capacités sont cohérentes avec les limites.

## Critères de succès
- Aucune responsabilité en conflit avec les limites.
- Cohérence entre `contract.json`, `contract.md` et `capabilities.json`.
