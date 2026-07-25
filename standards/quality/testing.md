# Standards de test

## Introduction

Ce document definit les standards de test applicables a tous les projets de l'organisation. L'objectif est de garantir un niveau de qualite eleve et consistent a travers l'ensemble des livrables.

## Pyramide de test

La pyramide de test guide la repartition des efforts de test :

```
        /\
       /  \
      / E2E\
     /------\
    / Inte-  \
   / gration  \
  /------------\
 /  Unitaires   \
/________________\
```

### Repartition cible

- Tests unitaires : 70% du temps de test.
- Tests d'integration : 20% du temps de test.
- Tests E2E : 10% du temps de test.

## Tests unitaires

### Definition

Un test unitaire verifie le comportement d'une unite de code isolee (fonction, methode, classe) en mockant ses dependances externes.

### Regles

- Un test unitaire teste UN comportement.
- Nommage : `[methode]_[scenario]_[comportement attendu]`.
- Structure AAA : Arrange, Act, Assert.
- Pas de logique conditionnelle dans les tests.
- Un test ne doit pas dependre d'un autre test.

```typescript
// Exemple avec Jest
describe("UserService", () => {
  describe("createUser", () => {
    it("should create a user when email is valid", async () => {
      // Arrange
      const repository = mock<IUserRepository>();
      const service = new UserService(repository);
      const dto: CreateUserDto = {
        email: "test@example.com",
        name: "Jean Dupont",
      };
      const expectedUser = User.create(dto);
      repository.save.mockResolvedValue(expectedUser);

      // Act
      const result = await service.createUser(dto);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(repository.save).toHaveBeenCalledWith(expectedUser);
    });

    it("should throw when email is invalid", async () => {
      const repository = mock<IUserRepository>();
      const service = new UserService(repository);

      await expect(
        service.createUser({ email: "invalid", name: "Test" })
      ).rejects.toThrow(ValidationError);
    });
  });
});
```

## Tests d'integration

### Definition

Un test d'integration verifie le comportement d'un composant avec ses dependances reelles (base de donnees, API externe, file d'attente).

### Regles

- Utiliser des conteneurs Docker pour les services externes (Testcontainers).
- Nettoyer les donnees entre chaque test.
- Tester les chemins critiques de bout en bout d'un service.
- Ne pas mocker ce qui est teste.

```typescript
// Exemple avec Testcontainers
describe("UserRepository Integration", () => {
  let container: PostgreSqlContainer;
  let repository: UserRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    const pool = new Pool({ connectionString: container.getConnectionUri() });
    repository = new UserRepository(pool);
    await runMigrations(pool);
  });

  afterAll(async () => {
    await container.stop();
  });

  it("should persist and retrieve a user", async () => {
    const user = User.create({
      email: "test@example.com",
      name: "Jean Dupont",
    });

    await repository.save(user);
    const found = await repository.findById(user.id);

    expect(found).not.toBeNull();
    expect(found?.email).toBe("test@example.com");
  });
});
```

## Tests End-to-End (E2E)

### Definition

Les tests E2E verifient le systeme complet du point de vue de l'utilisateur final, en traversant toutes les couches.

### Regles

- Couvrir les parcours utilisateur critiques uniquement.
- Utiliser Playwright ou Cypress.
- Les tests E2E sont executes en CI sur un environnement dedie.
- Definir des donnees de test fixes et reproductibles.

```typescript
// Exemple avec Playwright
test("user can complete an order", async ({ page }) => {
  await page.goto("/products");
  await page.click('[data-testid="product-1"]');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="email"]', "user@example.com");
  await page.fill('[name="address"]', "123 Rue de Paris");
  await page.click('[data-testid="submit-order"]');
  await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
});
```

## Couverture de code

- Objectif minimum : 80% de couverture de code.
- Couverture obligatoire a 100% sur les couches Domaine et Application.
- Les seuils sont verifies en CI.
- La couverture est analysee sur les branches, pas seulement les lignes.

```json
// Configuration Jest
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./src/domain/**": {
        "branches": 100,
        "functions": 100,
        "lines": 100
      }
    }
  }
}
```

## Mocks et stubs

- Utiliser un framework de mock officiel (Jest mocks, sinon.js, Mockito).
- Ne pas mocker ce qui ne vous appartient pas (bibliotheques tiers).
- Les mocks doivent etre simples et previsibles.
- Verifier les interactions uniquement quand c'est pertinent.

## Commandes

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test"
  }
}
```

## Integration CI

- Les tests unitaires et d'integration sont executes sur chaque commit.
- Les tests E2E sont executes sur chaque Pull Request et avant chaque release.
- Un echec de test bloque le merge.
- Les tests fleaky sont identifies et corriges prioritairement.
