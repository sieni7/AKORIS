# Conventions de nommage

## Introduction

Ce document definit les regles de nommage applicables a l'ensemble des projets de l'organisation. L'objectif est de garantir la coherence, la lisibilite et la maintenabilite du code produit.

## Regles generales

- Les noms doivent etre explicites et reveler l'intention.
- Eviter les abreviations sauf si elles sont universellement reconnues (ex. `id`, `url`, `html`).
- Ne pas utiliser de caracteres accentues.
- Utiliser l'anglais pour les identifiants techniques. Le francais est autorise pour le contenu metier dans la documentation.
- Les acronymes de deux lettres sont en majuscules (ex. `IOBuffer`). Au-dela, seule la premiere lettre est majuscule (ex. `HtmlParser`).

## Conventions par langage et contexte

### PascalCase

Utilise pour :
- Noms de classes, d'interfaces, de types, d'enums et de decorateurs.
- Noms de composants dans les frameworks (React, Angular, Vue).
- Fichiers de composants React (`UserProfile.tsx`).

Exemples :
```
UserService
DatabaseConnection
HttpClient
OrderStatus (enum)
IUserRepository (interface)
```

### camelCase

Utilise pour :
- Variables, parametres de fonction et proprietes.
- Fonctions et methodes.
- Instances d'objets.

Exemples :
```
let userName = "Jean Dupont";
function fetchUserData(userId: string): UserData { ... }
const userService = new UserService();
const isValid = validateInput(inputData);
```

### kebab-case

Utilise pour :
- Noms de fichiers et de dossiers (sauf composants React/Angular).
- Fichiers de configuration.
- Noms de packages npm.
- URLs et routes.

Exemples :
```
user-profile.ts
api-routes.ts
docker-compose.yml
feature-flags.config.ts
```

### SCREAMING_SNAKE_CASE

Utilise pour :
- Constantes globales immuables.
- Variables d'environnement.
- Enums (valeurs).

Exemples :
```
const MAX_RETRY_COUNT = 3;
const DATABASE_URL = process.env.DATABASE_URL;
enum LogLevel { DEBUG, INFO, ERROR, FATAL }
```

## Organisation des dossiers

### Structure recommandee

```
src/
  modules/
    users/
      user.controller.ts
      user.service.ts
      user.repository.ts
      user.model.ts
      user.routes.ts
    products/
      product.controller.ts
      ...
  shared/
    utils/
      date-helper.ts
      string-helper.ts
    middlewares/
      auth-middleware.ts
  config/
    database.config.ts
    app.config.ts
```

### Regles

- Les noms de dossiers sont en kebab-case.
- Un module regroupe des fichiers par domaine fonctionnel.
- Les dossiers partages (`shared`, `common`) contiennent le code reutilisable.
- Eviter les dossiers generiques comme `utils` non structures. Preferer des sous-dossiers thematiques.

## Fichiers

- Un fichier doit contenir une seule responsabilite principale.
- Nommer le fichier d'apres son export principal.
- Les fichiers de test portent le suffixe `.spec.ts` ou `.test.ts`.
- Les fichiers de types portent le suffixe `.types.ts`.
- Les fichiers de constantes portent le suffixe `.constants.ts`.

## Exemples concrets

```
// Mauvais
class user_service { ... }
function GetData() { ... }
const MA_VARIABLE = "toto";

// Bon
class UserService { ... }
function getData(): Data { ... }
const myVariable = "toto";
```
