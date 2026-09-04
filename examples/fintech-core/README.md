# Exemple — Noyau de services financiers (profil **Critical**)

> **Version** : 1.0.1
> **Profil** : Critical
> **Statut de l'instance** : PROPOSITION
> **Usage typique** : domaine sensible (finance, sécurité)

## Objectif

Illustrer une instance AKORIS au profil **Critical** pour un noyau de services financiers (moteur de transactions, gestion de portefeuille). Le profil Critical est le niveau de gouvernance le plus strict, réservé aux systèmes sensibles.

## Ce que contient cet exemple

| Emplacement | Contenu | Règle de frontière |
|---|---|---|
| `README.md` (ce fichier) | Explication de l'exemple | Documentation → `docs/` |
| `.akoris/manifest.json` | Identité, profil `critical`, agents `all-critical` | Gouvernance → `.akoris/` |
| `.akoris/state.json` | État courant | Gouvernance → `.akoris/` |
| `.akoris/.gitignore` | Exclusion des secrets | Gouvernance → `.akoris/` |

## Propriétés Critical appliquées

Conformément à `registry/profiles/critical.json` :

| Propriété | Valeur Critical |
|---|---|
| Preuves | E1 + E2 + E3 (preuve forte) |
| Quality Gates | mode `complete+reinforced`, revue externe |
| Audit | obligatoire + externe |
| ADR | requis + revue externe |
| Decision Gate | requis + multiple |

## Gouvernance renforcée

Le profil Critical exige un **niveau de preuve E3** (commit signé GPG / signature cryptographique) et un **audit externe obligatoire** pour tout release. Toute transition `VALIDATED → RELEASED` requiert un **Decision Gate humain** (`02_GOVERNANCE.md` §4.1.1).

---

*Exemple AKORIS v1.0.1 — Critical*
