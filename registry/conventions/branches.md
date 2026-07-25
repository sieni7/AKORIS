# Conventions de branches

Ce projet utilise **Git Flow** adapte.

## Branches principales

| Branche | Usage |
|---------|-------|
| `main` | Production, code stable et deploye |
| `develop` | Integration, code en cours de validation |

## Branches de support

| Branche | Source | Cible | Usage |
|---------|--------|-------|-------|
| `feature/*` | `develop` | `develop` | Nouvelle fonctionnalite |
| `fix/*` | `develop` | `develop` | Correction de bug |
| `hotfix/*` | `main` | `main` + `develop` | Correction urgente en production |
| `release/*` | `develop` | `main` + `develop` | Preparation de release |
| `docs/*` | `develop` | `develop` | Documentation |
| `refactor/*` | `develop` | `develop` | Refactoring |
| `experiment/*` | `develop` | `develop` | Experimentation (supprimee apres) |

## Regles de nommage

- Utiliser le format `<type>/<description-courte>`.
- Description en kebab-case, en anglais de preference.
- Inclure l'identifiant de la tâche si pertinent : `feature/JIRA-123-user-auth`.
- Pas de caracteres speciaux, accents ou espaces.

## Cycle de vie

1. Creer la branche depuis la source appropriee.
2. Developper et committer regulierement.
3. Rebasser sur la branche source avant la pull request.
4. Creer une pull request vers la branche cible.
5. Apres validation et merge, supprimer la branche.
