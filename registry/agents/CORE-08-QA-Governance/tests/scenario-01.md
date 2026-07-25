# Test Scenario 01 — Contract Validation

## Objectif
Vérifier que le contrat de l'agent CORE-08 QA Governance est complet et valide.

## Préconditions
- Fichier `contract.json` présent et valide JSON.
- Fichier `contract.md` présent avec toutes les sections requises.

## Étapes
1. Lire `contract.json` et valider sa structure JSON.
2. Vérifier la présence des champs : id, name, version, domain, criticity, mission, responsibilities, limits, inputs, outputs, qualityGates, activation, dependencies, interactions, kpis, tokenEstimate, tags.
3. Vérifier que `id` vaut "CORE-08".
4. Vérifier que `version` suit le format sémantique (x.y.z).
5. Vérifier que `tags` contient "core", "quality", "audit".
6. Vérifier que `kpis` contient au moins 3 entrées.
7. Vérifier que les `dependencies` sont des IDs valides d'agents existants.
8. Lire `contract.md` et vérifier la présence des sections : Identité, Mission, Responsabilités, Limites, Entrées, Sorties, Critères de qualité, Conditions d'activation, Interactions, Matrice RACI.

## Résultat attendu
- Tous les champs obligatoires sont présents et valides.
- Le contrat est cohérent entre `contract.json` et `contract.md`.
- La Matrice RACI est complète et référencée.

## Critères de succès
- Validation JSON réussie.
- Tous les champs requis non vides.
- Cohérence sémantique entre les deux formats.
