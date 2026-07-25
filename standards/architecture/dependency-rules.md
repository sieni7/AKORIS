# Regles de dependances entre modules

## Introduction

Ce document definit les regles de gestion des dependances entre modules au sein des projets de l'organisation. L'objectif est d'eviter les couplages inde sirables et de maintenir une architecture modulaire et evolutive.

## Principes fondamentaux

### Acyclic Dependencies Principle (ADP)

Le graphe de dependances entre modules ne doit pas contenir de cycle. Un cycle de dependances rend le systeme impossible a deployer, tester et maintenir independamment.

### Stable Dependencies Principle (SDP)

Les modules doivent dependre dans la direction de la stabilite. Un module stable (peu de raisons de changer) est au sommet de la hierarchie des dependances.

### Stable Abstractions Principle (SAP)

Un module stable doit etre abstrait (interfaces) pour pouvoir etre etendu sans etre modifie. Un module instable doit etre concret.

## Regles applicables

### Regle 1 : Pas de dependances circulaires

```typescript
// INTERDIT
// module-a.ts
import { ModuleB } from "./module-b";
export class ModuleA {
  constructor(private b: ModuleB) {}
  doSomething(): void { this.b.doSomethingElse(); }
}

// module-b.ts
import { ModuleA } from "./module-a";
export class ModuleB {
  constructor(private a: ModuleA) {}
  doSomethingElse(): void { this.a.doSomething(); }
}
```

Solution : introduire une interface partagee ou un module mediateur.

```typescript
// interfaces.ts
export interface ServiceA { doSomething(): void; }
export interface ServiceB { doSomethingElse(): void; }

// module-a.ts
export class ModuleA implements ServiceA {
  constructor(private b: ServiceB) {}
  doSomething(): void { this.b.doSomethingElse(); }
}
```

### Regle 2 : Dependances unidirectionnelles

Les modules doivent etre organises en couches avec des dependances strictement descendantes.

```
modules/users/  -->  modules/shared/
modules/orders/ -->  modules/shared/
modules/orders/ -->  modules/users/   (interdit sauf abstraction)
```

### Regle 3 : Interface ownership

L'interface appartient au module consommateur, pas au module implementateur.

```typescript
// modules/orders/ports/payment-gateway.port.ts
export interface PaymentGatewayPort {
  charge(amount: number, token: string): Promise<PaymentResult>;
}

// modules/payments/adapters/stripe-adapter.ts
import { PaymentGatewayPort } from "../../orders/ports/payment-gateway.port";

export class StripeAdapter implements PaymentGatewayPort {
  async charge(amount: number, token: string): Promise<PaymentResult> {
    // Implementation Stripe
  }
}
```

### Regle 4 : Modules partages explicites

Tout contenu partage entre modules doit etre explicitement place dans un module `shared` ou `common`.

```typescript
// modules/shared/types/uuid.ts
export type UUID = string & { readonly brand: unique symbol };

// modules/shared/errors/app-error.ts
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
}
```

### Regle 5 : Interdiction des Barrel files profonds

Limiter les barrel files (index.ts) a un seul niveau. Pas de re-export en chaine.

```typescript
// modules/users/index.ts
export { UserService } from "./user.service";
export { UserController } from "./user.controller";
export type { User, CreateUserDto } from "./user.types";

// INTERDIT : re-export de re-export
// shared/index.ts -> utils/index.ts -> helpers/index.ts
```

## Verification des dependances

### Outil recommande : dependency-cruiser

Configuration minimale :

```json
{
  "forbidden": [
    {
      "name": "no-circular",
      "severity": "error",
      "from": {},
      "to": { "circular": true }
    },
    {
      "name": "no-domain-deps",
      "severity": "error",
      "from": { "path": "^src/domain" },
      "to": { "path": "^(src/infrastructure|src/application)" }
    },
    {
      "name": "no-infra-deps-from-presentation",
      "severity": "error",
      "from": { "path": "^src/presentation" },
      "to": { "path": "^src/infrastructure" }
    }
  ]
}
```

### Regles de verification en CI

- Toute Pull Request doit passer la verification des dependances.
- Les violations de regles bloquent le merge.
- Les exceptions doivent etre approuvees par l'architecture team.

## Gestion des dependances externes

### Regles pour les packages npm

- Les dependances doivent etre explicites dans `package.json`.
- Interdire les dependances transitives non declarees.
- Utiliser un lockfile (package-lock.json ou yarn.lock).
- Les licenses des dependances doivent etre compatibles avec le projet.

### Dependances du Domaine

La couche Domaine NE DOIT JAMAIS avoir de dependances externes, sauf exceptions approuvees (ex. date-fns pour les dates).

```json
{
  "name": "@akoris/domain",
  "dependencies": {}
}
```

## Strategie de migration

1. Identifier les violations avec dependency-cruiser.
2. Creer des tickets pour chaque cycle de dependance.
3. Extraire les interfaces partagees.
4. Inverser les dependances via l'injection de dependances.
5. Valider avec la verification automatique en CI.
