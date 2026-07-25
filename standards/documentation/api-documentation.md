# Standards de documentation d'API

## Introduction

Ce document definit les regles pour la documentation des APIs dans l'organisation. Deux formats sont utilises selon le contexte : OpenAPI pour les specifications d'API REST et JSDoc pour la documentation du code source.

## OpenAPI (Swagger)

### Version

Toutes les specifications DOIVENT utiliser OpenAPI 3.1.0.

### Structure obligatoire d'une specification

```yaml
openapi: 3.1.0
info:
  title: Nom de l'API
  description: Description detaillee de l'API
  version: 1.0.0
  contact:
    name: Equipe API
    email: api@organisation.com
servers:
  - url: https://api.organisation.com/v1
    description: Serveur de production
  - url: https://api-staging.organisation.com/v1
    description: Serveur de staging
paths:
  /users:
    get:
      summary: Lister les utilisateurs
      description: Retourne une liste paginee d'utilisateurs
      operationId: listUsers
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        "200":
          description: Liste des utilisateurs
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PaginatedUsers"
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
```

### Regles

- Chaque endpoint DOIT avoir une `operationId` unique.
- Tous les schemas DOIVENT etre definis dans `components/schemas`.
- Les parametres obligatoires DOIVENT etre listes dans `required`.
- Les codes de retour HTTP DOIVENT etre documentes, au minimum 200, 400, 401, 403, 404, 500.
- Utiliser `$ref` pour referencer les schemas, pas de definition inline.
- Documenter les schemas d'erreur de maniere consistante.

### Schema d'erreur standard

```yaml
ErrorResponse:
  type: object
  required:
    - status
    - message
    - timestamp
  properties:
    status:
      type: integer
      description: Code HTTP
    message:
      type: string
      description: Message d'erreur
    details:
      type: array
      items:
        type: string
      description: Details supplementaires
    timestamp:
      type: string
      format: date-time
```

### Nommage des schemas

- PascalCase pour les noms de schemas.
- Suffixes explicites : `Request`, `Response`, `Dto`, `Error`.

## JSDoc

### Format

Tous les exports publics de fonctions et methodes DOIVENT etre documentes en JSDoc.

```typescript
/**
 * Cree un nouvel utilisateur dans le systeme.
 *
 * @param data - Les donnees de creation de l'utilisateur
 * @param options - Options de creation optionnelles
 * @returns L'utilisateur cree
 * @throws {ValidationError} Si les donnees sont invalides
 * @throws {DuplicateEmailError} Si l'email existe deja
 *
 * @example
 * const user = await createUser(
 *   { email: "user@example.com", name: "Jean" },
 *   { sendWelcomeEmail: true }
 * );
 */
async function createUser(
  data: CreateUserDto,
  options?: CreateUserOptions
): Promise<User> { ... }
```

### Regles

- `@param` pour chaque parametre avec type et description.
- `@returns` pour la valeur de retour.
- `@throws` pour les exceptions documentees.
- `@example` pour illustrer l'utilisation (optionnel mais recommande).
- `@deprecated` avec explication et alternative.

### Documentation des interfaces

```typescript
/**
 * Repository pour la gestion des utilisateurs.
 */
interface IUserRepository {
  /**
   * Recherche un utilisateur par son identifiant.
   *
   * @param id - Identifiant unique de l'utilisateur
   * @returns L'utilisateur trouve ou null
   */
  findById(id: string): Promise<User | null>;

  /**
   * Enregistre un utilisateur.
   *
   * @param user - L'utilisateur a enregistrer
   */
  save(user: User): Promise<void>;
}
```

## Documentation des endpoints

Chaque endpoint DOIT etre documente avec au moins :

- `summary` : phrase courte decrivant l'action (imperatif).
- `description` : description detaillee, incluant le comportement attendu.
- `parameters` : tous les parametres avec leur type, format et contraintes.
- `responses` : tous les codes de retour possibles avec leur schema.

## Versionnement

- L'API est versionnee dans le chemin : `/v1/`, `/v2/`.
- La version dans le fichier OpenAPI suit le semver.
- Un nouveau fichier OpenAPI est cree pour chaque version majeure.

## Maintenance

- Les fichiers OpenAPI sont stockes dans `docs/api/`.
- Chaque version a son propre fichier : `openapi-v1.yaml`, `openapi-v2.yaml`.
- Les Breaking Changes necessitent un nouveau fichier de version.
- Les specifications sont validees en CI avec `@redocly/cli`.

## Outils recommandés

- **Redoc** pour le rendu de la documentation.
- **@redocly/cli** pour la validation des specifications.
- **Swagger Editor** pour l'edition.
- **openapi-generator** pour la generation de code client.
