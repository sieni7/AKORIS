# Test Scenario 02 — Limits Respect Test

## Objectif
Vérifier que l'agent CORE-05 Security Officer respecte ses limites définies dans le contrat.

## Préconditions
- Contrat de l'agent CORE-05 validé.
- Liste des responsabilités des agents QA-03 et CORE-07 disponibles.

## Étapes
1. Lire les `limits` depuis `contract.json`.
2. Vérifier que "Ne déploie pas l'infrastructure technique" est présent.
3. Vérifier que "N'audite pas le code source" est présent et référence QA-03.
4. Vérifier que "Ne gère pas les correctifs de sécurité au niveau système" est présent et référence CORE-07.
5. Vérifier qu'aucune responsabilité dans `responsibilities` n'empiète sur les limites.
6. Vérifier que les capacités dans `capabilities.json` sont alignées sur les limites.
7. Vérifier que les `cannot` dans `capabilities.json` incluent deploy_infrastructure et audit_code.

## Résultat attendu
- Les limites sont respectées dans toutes les sections du contrat.
- Aucune responsabilité ne viole les limites déclarées.
- Les capacités sont cohérentes avec les limites.

## Critères de succès
- Aucune responsabilité en conflit avec les limites.
- Cohérence entre `contract.json`, `contract.md` et `capabilities.json`.
