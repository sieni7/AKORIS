# Conventions de commits

Ce projet suit la specification **Conventional Commits** (https://www.conventionalcommits.org/).

## Format

```
<type>(<scope optionnel>): <description>

<corps optionnel>

<pied optionnel>
```

## Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalite |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `style` | Format, mise en forme (pas de changement logique) |
| `refactor` | Refactoring sans changement fonctionnel |
| `perf` | Amelioration de performance |
| `test` | Ajout ou correction de tests |
| `build` | Systeme de build ou dependances |
| `ci` | Configuration CI/CD |
| `chore` | Taches diverses, maintenance |
| `revert` | Annulation d'un commit precedent |

## Regles

- La description commence par une minuscule, sans point final.
- Le scope est un nom court (ex: `auth`, `api`, `db`).
- Le corps explique le pourquoi et le comment, pas le quoi.
- Le pied peut referencer des issues : `Closes #123`, `Refs #456`.
- Les breaking changes sont indiques par `!` apres le type/scope ou par `BREAKING CHANGE` dans le pied.

## Exemples

```
feat(auth): ajouter la connexion par SSO

Mise en place de l'authentification via SAML et OIDC.

Closes #42
```

```
fix(api): corriger la validation du format email

L'expression reguliere n'acceptait pas les domaines avec tirets.

Refs #87
```

```
docs: ajouter le guide de contribution
```

```
refactor!: renommer le module User en Identity

BREAKING CHANGE: Le module User est remplace par Identity.
Toutes les references doivent etre mises a jour.
```
