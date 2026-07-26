# ADR-003 : Machine à états pour le cycle de vie du projet

**Statut :** Approuvé  
**Date :** 2026-07-26  
**Décideur :** AKORIS Core Team  

## Contexte

AKORIS gouverne le développement logiciel : il faut un mécanisme formel pour suivre et contraindre l'évolution du projet (draft → développement → audit → release). Sans machine à états, rien n'empêche de passer en production sans audit.

## Options envisagées

| Option | Points forts | Points faibles |
|--------|-------------|----------------|
| **Machine à états intégrée** | Contrôle total, transitions avec Quality Gates | Développement internal |
| **Bibliothèque externe (XState)** | Riche, visuelle, testée | Surcharge pour 7 états, courbe d'apprentissage |
| **Fichier JSON simple + logique** | Simple, lisible, versionnable | Validation manuelle des transitions |

## Décision

**Fichier `state.json` + logique dans `StateMachineEngine`.**

La machine est définie dans `registry/state-machine.json` (séparation données / logique). Le service `StateMachineEngine` charge la machine, valide les transitions et persiste l'état.

## Conséquences

- 7 états, 8 transitions, toutes avec gates et autorisations
- État persistant dans `.akoris/state.json`
- 5 sous-commandes : `show`, `history`, `transition`, `info`, `export`
- Export en 3 formats : markdown, json, text
- Vérification systématique : `canTransition()` avant `transition()`
- Quality Gates vérifiés par `quality check` avant chaque transition

## Références

- Fichier machine : `registry/state-machine.json`
- Service : `src/services/state-machine.service.ts`
