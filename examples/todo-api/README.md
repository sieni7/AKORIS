# Exemple — API de gestion de tâches (profil **Standard**)

> **Version** : 1.0.1
> **Profil** : Standard
> **Statut de l'instance** : PROPOSITION
> **Référence** : guide de démarrage `docs/guides/00_GETTING_STARTED.md`

## Objectif

Illustrer une instance AKORIS au profil **Standard** via une API REST de gestion de tâches. Cet exemple montre la *forme* conforme d'une instance, en respectant la frontière `.akoris/` vs `docs/`.

## Ce que contient cet exemple

| Emplacement | Contenu | Règle de frontière |
|---|---|---|
| `README.md` (ce fichier) | Explication de l'exemple | Documentation → côté `docs/` |
| `.akoris/manifest.json` | Identité, profil | Gouvernance → côté `.akoris/` |
| `.akoris/state.json` | État courant | Gouvernance → côté `.akoris/` |
| `.akoris/.gitignore` | Exclusion des secrets | Gouvernance → côté `.akoris/` |

> **Règle** (`constitution/00_AKORIS.md` §8.1) : Une information de gouvernance n'appartient pas à `docs/`. Une information expliquant le logiciel n'appartient pas à `.akoris/`.

## Propriétés Standard appliquées

Conformément à `registry/profiles/standard.json` :

| Propriété | Valeur Standard |
|---|---|
| Preuves | E1 (Trace) + E2 (Intégrité) |
| Quality Gates | mode `complete` (8) |
| Audit | planifié |
| ADR | requis |
| Decision Gate | requis |

## Machine à états

L'instance démarre en `PROPOSITION` (`registry/state-machine.json`). La transition `VALIDATED → RELEASED` requiert un **Decision Gate humain** (`02_GOVERNANCE.md` §4.1.1).

---

*Exemple AKORIS v1.0.1 — Standard*
