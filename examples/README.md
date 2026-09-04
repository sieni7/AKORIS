# Exemples AKORIS

> **Version** : 1.0.1
> **Statut** : Exemples illustratifs
> **Date** : 2026-09-04

Cette section contient des exemples concrets d'instances AKORIS, un par profil de gouvernance. Chaque exemple illustre :

- la structure canonique `.akoris/` (manifest, state, registry) ;
- la **frontière** `.akoris/` (gouvernance) vs `docs/` (documentation du logiciel) ;
- l'application concrète d'un profil de gouvernance.

## Les trois exemples

| Exemple | Profil | Usage typique |
|---|---|---|
| [`scripts-prototype/`](scripts-prototype/) | **Lite** | Prototype, script, projet solo |
| [`todo-api/`](todo-api/) | **Standard** | Projet professionnel livré (API) |
| [`fintech-core/`](fintech-core/) | **Critical** | Domaine sensible (financier, sécurité) |

## Principe

> **Règle** (`constitution/00_AKORIS.md` §8.1) : Une information de gouvernance n'appartient pas à `docs/`. Une information expliquant le logiciel n'appartient pas à `.akoris/`.

Ces exemples sont **illustratifs et minimaux** : ils montrent la *forme* d'une instance conforme à la version canonique. La création complète des artefacts (contrats, agents, policies, profil) est détaillée dans le guide de démarrage (`docs/guides/00_GETTING_STARTED.md`) et saura être outillée par la branche d'implémentation (`impl`).

---

*AKORIS v1.0.1 — Exemples*
