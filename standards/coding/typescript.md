# Standards TypeScript

## Introduction

Ce document definit les regles et bonnes pratiques pour l'ecriture de code TypeScript dans l'ensemble des projets de l'organisation.

## Configuration TypeScript

### Fichier tsconfig.json de base

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Le mode `strict: true` est obligatoire. Il active tous les controles stricts de TypeScript.

## Types

### Priorite aux types forts

- `any` est interdit sauf cas exceptionnel dument justifie et approuve en revue.
- Utiliser `unknown` quand le type est vraiment inconnu.
- Utiliser `never` pour les branches inaccessibles.

```typescript
// Mauvais
function process(data: any): any { ... }

// Bon
function process(data: unknown): string { ... }
```

### Inference de type

Laisser TypeScript inferer les types quand c'est evident.

```typescript
// Inutile
const message: string = "Bonjour";

// Mieux
const message = "Bonjour";
```

Toujours typer explicitement les signatures de fonctions et les exports de modules.

### Types vs Interfaces

- Utiliser `interface` pour les objets qui representent des contrats ou des formes d'API.
- Utiliser `type` pour les unions, intersections, tuples et types primitifs derives.

```typescript
// interface pour les contrats
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// type pour les unions et derives
type ApiResponse<T> = { success: true; data: T } | { success: false; error: Error };
type UserId = string;
type UserStatus = "active" | "inactive" | "suspended";
```

### Generiques

```typescript
// Fonction generique
function wrapInResult<T>(data: T): Result<T> {
  return { success: true, data };
}

// Contrainte de type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Interface generique
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Utility types

Utiliser les utility types de TypeScript pour eviter les repetitions.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type PublicUser = Omit<User, "password">;
type PartialUser = Partial<User>;
type CreateUserDto = Pick<User, "name" | "email" | "password">;
type UserMap = Record<string, User>;
type ReadonlyUser = Readonly<User>;
```

## ESLint

### Configuration essentielle

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "import/order": ["error", { "alphabetize": { "order": "asc" } }],
    "no-console": "warn",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"]
  }
}
```

## Bonnes pratiques

### Optional chaining et nullish coalescing

```typescript
// Mauvais
const name = user && user.profile && user.profile.name;
const count = config.retryCount || 3;

// Bon
const name = user?.profile?.name;
const count = config.retryCount ?? 3;
```

### Destructuring

```typescript
// Mauvais
function displayUser(user: User) {
  console.log(user.name, user.email, user.role);
}

// Bon
function displayUser({ name, email, role }: User) {
  console.log(name, email, role);
}
```

### Discriminated unions

```typescript
type ApiEvent =
  | { type: "loading" }
  | { type: "success"; data: unknown }
  | { type: "error"; message: string };

function handleEvent(event: ApiEvent): void {
  switch (event.type) {
    case "loading":
      console.log("Chargement...");
      break;
    case "success":
      console.log("Donnees recues:", event.data);
      break;
    case "error":
      console.error("Erreur:", event.message);
      break;
  }
}
```

### Branded types

```typescript
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function getUserById(id: UserId): User { ... }
function getOrderById(id: OrderId): Order { ... }

const userId = "abc" as UserId;
const orderId = "xyz" as OrderId;

getUserById(userId); // OK
getUserById(orderId); // Erreur de type
```

## Structures de controle

- Favoriser les early returns.
- Eviter les else inutiles.
- Utiliser des guard clauses.

```typescript
// Mauvais
function processUser(user: User | null): string {
  if (user !== null) {
    if (user.isActive) {
      return "Actif";
    } else {
      return "Inactif";
    }
  } else {
    return "Inconnu";
  }
}

// Bon
function processUser(user: User | null): string {
  if (user === null) return "Inconnu";
  if (!user.isActive) return "Inactif";
  return "Actif";
}
```
