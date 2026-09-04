# Exemple — Prototype de scripts (profil **Lite**)

> **Version** : 1.0.1
> **Profil** : Lite
> **Statut de l'instance** : PROPOSITION
> **Usage typique** : prototype, script d'automatisation, projet solo

## Objectif

Illustrer une instance AKORIS au profil **Lite** pour un ensemble de scripts d'automatisation (par exemple, un script de sauvegarde ou de traitement de fichiers). Le profil Lite est conçu pour les prototypes et projets solo, avec une gouvernance allégée.

## Ce que contient cet exemple

| Emplacement | Contenu | Règle de frontière |
|---|---|---|
| `README.md` (ce fichier) | Explication de l'exemple | Documentation → `docs/` |
| `.akoris/manifest.json` | Identité, profil `lite` | Gouvernance → `.akoris/` |
| `.akoris/state.json` | État courant | Gouvernance → `.akoris/` |
| `.akoris/.gitignore` | Exclusion des secrets | Gouvernance → `.akoris/` |

## Propriétés Lite appliquées

Conformément à `registry/profiles/lite.json` :

| Propriété | Valeur Lite |
|---|---|
| Preuves | E1 (Trace) uniquement |
| Quality Gates | mode `essential` (`QG-001`, `QG-002`) |
| Audit | différé (`deferred`) |
| ADR | non requis |
| Decision Gate | optionnel |

## Différence clé avec le Standard

Le profil Lite limite la profondeur de gouvernance : preuve E1, gates essentiels, audit différé et Decision Gate optionnel. La transition `VALIDATED → RELEASED` reste néanmoins soumise à la règle humaine si un release est décidé (`02_GOVERNANCE.md` §4.1.1).

---

*Exemple AKORIS v1.0.1 — Lite*
