# ADR-003 : Pourquoi une machine à états ?

## Contexte

Un projet AKORIS passe par plusieurs phases : conception, développement, validation, livraison. Ces phases ont des règles (Quality Gates) et des autorisations (rôles RACI). Sans formalisation, le projet pourrait passer d'un état à un autre de manière arbitraire.

## Décision

Nous utilisons une machine à états formelle avec 7 états et 8 transitions, stockée dans `state-machine.json`.

## Alternatives considérées

- **Pas de machine** : les phases sont simplement descriptives, sans contrôle. Le CLI n'impose aucune discipline.
- **Machine en dur dans le code** : inflexible, nécessite une recompilation pour tout changement.
- **Machine externe (service distant)** : lourd, nécessite un réseau et une infrastructure.

## Justification

- La machine est déclarative (JSON) : elle peut être modifiée sans recompiler le CLI, et même personnalisée par projet.
- Elle impose une discipline : une transition ne peut être exécutée que si les Quality Gates requis sont PASS.
- Elle est portable : le même fichier peut être interprété par d'autres outils (SDK, API).
- Elle est alignée avec la philosophie "gouvernance first" d'AKORIS.

## Conséquences

- Les commandes `state show`, `state transition`, `state export` dépendent de ce fichier.
- Les projets peuvent ajouter des états personnalisés ou modifier les transitions (sans casser le CLI, car le CLI lit le fichier dynamiquement).

## Statut

Accepté.
