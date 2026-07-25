# Conventions de nommage du projet

## Principes generaux

- Utiliser des noms explicites et en anglais pour le code, en francais pour la documentation metier.
- Pas d'abreviations sauf si largement reconnues (API, URL, HTTP).
- Utiliser le cas adapte au contexte : camelCase, PascalCase, kebab-case, snake_case.
- Eviter les noms generiques (data, info, tmp) sauf dans des contextes tres limites.

## Fichiers et dossiers

- Dossiers : kebab-case (ex: `user-profile/`, `api-routes/`).
- Fichiers de code : kebab-case (ex: `user-service.ts`).
- Fichiers de configuration : kebab-case (ex: `docker-compose.yml`).
- Fichiers de documentation : MAJUSCULES avec underscore (ex: `README.md`, `CONTRIBUTING.md`).

## Code

- Variables et fonctions : camelCase (ex: `getUserById`, `isActive`).
- Classes et types : PascalCase (ex: `UserService`, `ApiResponse`).
- Constantes : UPPER_SNAKE_CASE (ex: `MAX_RETRY_COUNT`).
- Interfaces : PascalCase prefixe I optionnel, mais deconseille. Preferer `User` a `IUser`.
- Proprietes privees : prefixe `_` uniquement pour les champs prives en JavaScript/TypeScript.

## Base de donnees

- Tables : snake_case pluriel (ex: `users`, `access_logs`).
- Colonnes : snake_case (ex: `created_at`, `user_id`).
- Contraintes : prefixe type + nom table (ex: `pk_users`, `fk_users_role_id`).

## API

- Endpoints : kebab-case, pluriel (ex: `/api/users`, `/api/orders/{id}`).
- Parametres de requete : camelCase (ex: `?pageSize=20&sortBy=name`).
- Corps JSON : camelCase.
